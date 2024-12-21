const { ObjectId } = require("mongodb");
const { logFlowStatus } = require("../helpers/logging.helpers");
const { nextReminderUpdateConfig } = require("../config/flows.config");
const { getNestedField } = require("../helpers/formatting.helpers");
/**
 * Service class to handle database operations related to contacts, organizations, messages, and flows.
 */
class DatabaseService {
  /**
   * List of flow names that support bulk completion (when one flow with this name is set as completed, the rest are too, used for survey reminders).
   * @static
   * @type {string[]}
   */
  static BULK_COMPLETION_ENABLED_FLOWNAMES = ["survey"];
  static TEST_ONLY_FLOWNAMES = ["enham-ai-video-demo"];
  /**
   * Initializes the DatabaseService instance with the provided database client.
   * @param {Db} db - The MongoDB database client instance.
   */
  constructor(db) {
    this.db = db;
    this.contactCollection = this.db.collection("contacts");
    this.organizationCollection = this.db.collection("organizations");
    this.messagesCollection = this.db.collection("messages");
    this.sentFlowsCollection = this.db.collection("flow_history");
    this.availableFlowsCollection = this.db.collection("flows");
  }
  /**
   * Retrieves an organization by its phone number.
   * @param {string} organizationNumber - The phone number of the organization.
   * @returns {Promise<Object|null>} The organization document or null if not found.
   */
  async getOrganization(organizationNumber) {
    try {
      const organization = await this.organizationCollection.findOne({
        "organizationPhoneNumber": organizationNumber,
      });
      return organization;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * Updates a user's information in the database.
   * @param {string} WaId - The WhatsApp ID of the user.
   * @param {string} organizationPhoneNumber - The phone number of the organization the user belongs to.
   * @param {Object} updateDoc - The fields to update.
   * @returns {Promise<void>}
   */
  async updateUser(WaId, organizationPhoneNumber, updateDoc) {
    try {
      const contactOrganization = await this.organizationCollection.findOne({
        "organizationPhoneNumber": organizationPhoneNumber,
      });
      const contactOrganizationId = contactOrganization._id;
      const contact = await this.contactCollection.findOneAndUpdate(
        { "WaId": WaId, "organizationId": contactOrganizationId },
        { "$set": updateDoc }
      );
      console.log("found contact!!!!!!!", contact);
    } catch (err) {
      console.log(err);
    }
  }
  async getScheduledContacts(flowName, currentDateTime, organizationId) {
    //TO-DO: test this
    console.log(flowName);
    const { schedules, prefix, topLevelFlag, scheduleFrequencyFieldPath } =
      nextReminderUpdateConfig[flowName];
    const flow = await this.availableFlowsCollection.findOne({
      "flowName": flowName,
    });
    const scheduledContacts = await this.contactCollection
      .aggregate([
        {
          $match: {
            "organizationId": new ObjectId(organizationId),
            [topLevelFlag]: true,
            $expr: {
              $and: [
                {
                  $eq: [
                    { $dayOfMonth: `$${prefix}_nextDetailCheckDate` },
                    { $dayOfMonth: currentDateTime },
                  ],
                },
                {
                  $eq: [
                    { $month: `$${prefix}_nextDetailCheckDate` },
                    { $month: currentDateTime },
                  ],
                },
                {
                  $eq: [
                    { $year: `$${prefix}_nextDetailCheckDate` },
                    { $year: currentDateTime },
                  ],
                },
              ],
            },
          },
        },
      ])
      .toArray();
    const bulkOps = scheduledContacts
      .map((contact) => {
        const frequency = getNestedField(contact, scheduleFrequencyFieldPath);
        const daysToAdd = schedules[frequency];
        if (!daysToAdd) {
          console.warn(`No configuration found for frequency: ${frequency}`);
          return null;
        }

        const nextReminderDate = new Date(
          new Date(contact[`${prefix}_nextDetailCheckDate`]).getTime() +
            daysToAdd * 24 * 60 * 60 * 1000
        );

        return {
          updateOne: {
            filter: { _id: contact._id },
            update: {
              $set: {
                [`${prefix}_nextDetailCheckDate`]: nextReminderDate,
                [`${prefix}_lastDetailCheckDate`]: currentDateTime,
              },
            },
          },
        };
      })
      .filter(Boolean);

    if (bulkOps.length > 0) {
      await this.contactCollection.bulkWrite(bulkOps);
    }

    console.log(scheduledContacts);
    return {
      flow,
      contactList: scheduledContacts,
    };
  }
  async getUnresponsiveContacts(flowName, reminderTime, organizationId) {
    const flow = await this.availableFlowsCollection.findOne({
      flowName,
    });
    const contactReminderField = `${flowName}_reminderSent`;
    const unansweredSurveys = await this.sentFlowsCollection
      .aggregate([
        {
          $match: {
            "OrganizationId": new ObjectId(organizationId),
            "flowName": flowName,
            "Status": { $in: ["read", "delivered"] },
            "reminderSent": {
              $exists: false,
            },
            $or: [{ isReminder: { $exists: false } }, { isReminder: false }],
            "UpdatedAt": { $lt: reminderTime },
          },
        },
        {
          $lookup: {
            from: "contacts",
            localField: "ContactId",
            foreignField: "_id",
            as: "contactInfo",
          },
        },
        {
          $unwind: "$contactInfo",
        },
        {
          $match: {
            [`contactInfo.${contactReminderField}`]: { $exists: false },
          },
        },
      ])
      .toArray();
    const WaIds = unansweredSurveys.map((survey) => ({
      WaId: survey.contactInfo.WaId,
      ProfileName: survey.contactInfo.ProfileName,
    }));
    console.log(unansweredSurveys);
    const contactIds = unansweredSurveys.map(
      (survey) => survey.contactInfo._id
    );
    console.log(contactIds);
    if (process.env.NODE_ENV === "production") {
      await this.sentFlowsCollection.updateMany(
        { ContactId: { $in: contactIds }, "flowName": flowName },
        { $set: { "reminderSent": true } }
      );
      await this.contactCollection.updateMany(
        { _id: { $in: contactIds } },
        { $set: { [`contactInfo.${contactReminderField}`]: true } }
      );
    }
    const testUser = { WaId: "38269372208", ProfileName: "Daria" };
    return {
      flow,
      contactList: [...WaIds, testUser],
    };
  }
  /**
   * Adds a contact to an organization's contact list.
   * @param {string} organizationNumber - The phone number of the organization.
   * @param {ObjectId} contactId - The ID of the contact to add.
   * @returns {Promise<void>}
   */
  async updateOrganizationWithContact(organizationId, contactId) {
    try {
      await this.organizationCollection.updateOne(
        { "_id": new ObjectId(organizationId) },
        {
          $push: {
            organizationContacts: contactId,
          },
        }
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * Retrieves the messaging service SID associated with an organization.
   * @param {string} organizationPhoneNumber - The phone number of the organization.
   * @returns {Promise<string>} The messaging service SID (from twilio).
   */
  async getMessagingServiceSid(organizationPhoneNumber) {
    try {
      const organization = await this.organizationCollection.findOne({
        "organizationPhoneNumber": organizationPhoneNumber,
      });
      return organization.organizationMessagingServiceSid;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * Saves a new user in the database and associates them with the organization.
   * @param {Object} userData - The user data to insert.
   * @param {string} organizationNumber - The phone number of the organization the user is associated with.
   * @returns {Promise<void>}
   */
  async saveUser(userData, organizationId) {
    try {
      const result = await this.contactCollection.insertOne({
        "WaId": userData.WaId,
        "ProfileName": userData.ProfileName,
        "organizationId": organizationId,
        "CreatedAt": new Date(),
        "LastSeenAt": new Date(),
      });

      const insertedId = result.insertedId;
      await this.updateOrganizationWithContact(organizationId, insertedId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  //67066b4bc506e2fd89e999f7
  /**
   * Retrieves a user by their WhatsApp ID within a specific organization.
   * @param {string} recipient - The WhatsApp ID of the user.
   * @param {string} organizationPhoneNumber - The phone number of the organization the user belongs to.
   * @returns {Promise<Object|null>} The user document or null if not found.
   */
  async getUser(WaId, organizationPhoneNumber, ProfileName = null) {
    try {
      const userOrganization = await this.getOrganization(
        organizationPhoneNumber
      );
      console.log(userOrganization);
      const userOrganizationId = userOrganization._id;
      const user = await this.contactCollection.findOne({
        "WaId": WaId,
        "organizationId": userOrganizationId,
      });
      if (!user) {
        await this.saveUser({ WaId, ProfileName }, userOrganizationId);
      }
      return user;
    } catch (err) {
      console.error(err);
      throw err; // Consider re-throwing for higher-level error handling
    }
  }
  /**
   * Saves a message to the database and associates it with a contact.
   * @param {Object} message - The message document to save.
   * @param {string} organizationPhoneNumber - The phone number of the organization the message is associated with.
   * @returns {Promise<void>}
   */
  async saveMessage(message, organizationPhoneNumber) {
    try {
      if (DatabaseService.TEST_ONLY_FLOWNAMES.includes(message.Flow)) {
        return;
      }
      const contact = await this.getUser(message.WaId, organizationPhoneNumber);
      await this.messagesCollection.insertOne({
        ...message,
        ContactId: contact._id,
      });
      console.log("the saved message looks like", {
        ...message,
        ContactId: contact._id,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * Updates the status of a message.
   * @param {string} messageSid - The SID of the message to update.
   * @param {string} status - The new status of the message.
   * @returns {Promise<void>}
   * {@see {@link updateFlowStatus}}
   */
  async updateMessageStatus(messageSid, status) {
    try {
      const updatedMessage = await this.messagesCollection.findOneAndUpdate(
        { MessageSid: messageSid },
        { $set: { Status: status } }
      );
      if (!updatedMessage) {
        return;
      }
      await this.updateFlowStatus(updatedMessage.trackedFlowId, status);

      console.log(`Message status updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Saves a flow to the database.
   * @param {Object} params - The parameters for saving the flow.
   * @param {string} params.WaId - WhatsApp ID of the user the flow is for.
   * @param {string} params.trackedFlowId - ID that the flow status and additional information is tracked by.
   * @param {string} params.flowName - Name of the flow.
   * @param {boolean} params.clientSideTriggered - Indicates if the flow was triggered client-side.
   * @param {string} params.organizationPhoneNumber - The phone number of the organization associated with the flow.
   * @param {boolean} [params.isReminder=false] - Indicates if the flow is a reminder.
   * @returns {Promise<void>}
   */
  async saveFlow({
    WaId,
    trackedFlowId,
    flowName,
    clientSideTriggered,
    organizationPhoneNumber,
    isReminder,
    extraFields = {},
  }) {
    try {
      if (DatabaseService.TEST_ONLY_FLOWNAMES.includes(flowName)) {
        return;
      }
      const contact = await this.getUser(WaId, organizationPhoneNumber);
      console.log(contact);
      const newFlowDoc = {
        CreatedAt: new Date(),
        flowName: flowName,
        ContactId: contact._id,
        OrganizationId: contact.organizationId,
        Status: "sent",
        clientSideTriggered,
        trackedFlowId,
        isReminder,
        ...extraFields,
      };
      await this.sentFlowsCollection.insertOne(newFlowDoc);
    } catch (err) {
      console.error(err);
    }
  }

  async checkFlowPermission(flowName, organizationId) {
    const flow = await this.availableFlowsCollection.findOne({
      flowName,
      organizationIds: { $in: [organizationId] },
    });
    return !!flow; // Returns true if a flow is found, false otherwise
  }

  /**
   * Updates the status of a flow.
   * @param {string} flowId - The ID of the flow to update.
   * @param {string} statusUpdate - The new status for the flow (e.g., "completed", "delivered").
   * @returns {Promise<void>}
   */

  async updateFlowStatus(flowId, statusUpdate) {
    const query = { "trackedFlowId": flowId };
    const update = {
      $set: {
        Status: statusUpdate,
        UpdatedAt: new Date(),
      },
    };
    if (statusUpdate === "completed") {
      const flow = await this.sentFlowsCollection.findOne(query);

      if (
        DatabaseService.BULK_COMPLETION_ENABLED_FLOWNAMES.includes(
          flow.flowName
        )
      ) {
        logFlowStatus(flowId, statusUpdate, true);
        await this.sentFlowsCollection.updateMany(
          {
            ContactId: flow.ContactId,
            flowName: flow.flowName,
          },
          update
        );
        return;
      } else {
        logFlowStatus(flowId, statusUpdate, false);
        await this.sentFlowsCollection.findOneAndUpdate(query, update);
      }
    } else if (statusUpdate === "delivered") {
      query.Status = { $nin: ["in_progress", "read", "completed"] };
      logFlowStatus(flowId, statusUpdate, false);
    } else {
      query.Status = { $nin: ["in_progress", "completed"] };
    }
    logFlowStatus(flowId, statusUpdate, false);
    await this.sentFlowsCollection.findOneAndUpdate(query, update);
  }
  /**
   * Updates the start time of a flow.
   * @param {string} flowId - The ID of the flow to update.
   * @returns {Promise<void>}
   */
  async updateFlowStartTime(flowId) {
    await this.sentFlowsCollection.findOneAndUpdate(
      { "trackedFlowId": flowId },
      {
        $set: {
          StartedAt: new Date(),
        },
      }
    );
  }
  /**
   * Adds a survey response to a flow.
   * @param {string} flowId - The ID of the flow to update.
   * @param {Object} update - The survey response to add.
   * @returns {Promise<void>}
   */
  async updateFlowSurvey(flowId, update) {
    await this.sentFlowsCollection.findOneAndUpdate(
      { "trackedFlowId": flowId },
      {
        $push: {
          surveyResponses: { ...update, CreatedAt: new Date() },
        },
      }
    );
  }
  /**
   * Updates the latest survey question sent in a flow with the user's response.
   * @param {string} flowId - The ID of the flow to update.
   * @param {string} userResponse - The user's response to the latest survey question.
   * @param {string} messageSid - The message SID associated with the user response.
   * @returns {Promise<void>}
   */
  async updateFlowWithResponse(flowId, userResponse, messageSid) {
    const flow = await this.sentFlowsCollection.findOne({
      "trackedFlowId": flowId,
    });
    const existingSurveyData = flow?.surveyResponses;
    if (!existingSurveyData || existingSurveyData.length === 0) {
      return;
    }
    const latestQuestion = existingSurveyData.sort(
      (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)
    )[0];
    await this.sentFlowsCollection.updateOne(
      {
        "trackedFlowId": flowId,
        "surveyResponses.CreatedAt": latestQuestion.CreatedAt,
      },
      {
        $set: {
          "surveyResponses.$.userResponse": userResponse,
          "surveyResponses.$.originalMessageSid": messageSid, // Add the userResponse property to the latest survey response
        },
      }
    );
  }
}

module.exports = { DatabaseService };
