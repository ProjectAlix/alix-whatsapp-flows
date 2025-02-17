const { createTranscriptionTask } = require("../helpers/cloud_tasks.helpers");
const {
  formatFirstSocialSurveyResponse,
} = require("../helpers/formatting.helpers");
const { v4: uuidv4 } = require("uuid");
const { BaseMessageHandler } = require("./BaseMessageHandler");
const {
  fatMacysSurveyConfig1,
  fatMacysSurveyConfig2,
  enhamPayrollQuizConfig,
  enhamPARegisterConfig,
} = require("../config/flows.config");

/**
 * Service for handling inbound messages from the Twilio API and triggering flows.
 * @extends BaseMessageHandler
 */
class InboundMessageHandler extends BaseMessageHandler {
  /**
   * Creates an instance of InboundMessageHandler.
   * @constructor
   * @param {Object} params - Parameters for the handler.
   * @param {Object} params.req - The request object.
   * @param {Object} params.res - The response object.
   * @param {string} params.organizationPhoneNumber - The organization phone number.
   * @param {Object} params.firestore - Firestore database instance.
   * @param {boolean} params.clientSideTriggered - Indicates if the request was triggered from the client side.
   * @param {boolean} params.isReminder - Indicates if this is a reminder message.
   */
  constructor({
    req,
    res,
    organizationPhoneNumber,
    firestore,
    clientSideTriggered,
    isReminder,
  }) {
    super({
      req,
      res,
      organizationPhoneNumber,
      firestore,
      clientSideTriggered,
      isReminder,
    });
  }

  /**
   * Main handler for processing messages based on user input.
   * @returns {Promise<void>}
   */

  async handle() {
    try {
      // get organization from database by phone number to save the inbound message with its ID
      const organization = await this.getUserOrganization();
      // get the contact information from the database (if the user has messaged the number previously their details will have been stored)

      const userInfo = await this.getUserInfo();
      //Adding additional properties to the inbound message to be stored in the database
      const messageToSave = {
        OrganizationId: organization?._id || null,
        ...this.body,
        CreatedAt: new Date(),
        Direction: "inbound",
        Status: "recieved",
      };
      //Pre-configured opt-out & opt-in messages, functionality is mostly handled by Twilio, but we update the user information by default as well
      if (this.body.Body === "OPT-OUT" || this.body.Body === "OPT-IN") {
        await this.handleOptOutOptIn();
        return this.res.status(204).send();
      }
      //check if the text of the first message is a preconfigured "trigger" message for a flow to start
      //TO DO add test for this part
      const trigger = this.body.Body.toLowerCase().trim();
      const flowTriggerFunction = organization.triggers[trigger];
      if (
        flowTriggerFunction &&
        typeof this[flowTriggerFunction] === "function"
      ) {
        await this[flowTriggerFunction].call(this, userInfo, messageToSave);
      } else {
        //if not a "trigger" message, calls handleExistingFlow
        /**
         * @see {@link handleExistingFlow}
         */
        await this.handleExistingFlow(userInfo, messageToSave);
      }
    } catch (err) {
      await this.handleFlowError(err);
      this.res.status(500).send(err);
    }
  }

  /**
   * Starts a specific flow based on the user data and message information.
   *
   * @param {Object} params - Parameters for starting the flow.
   * @param {Object} params.userInfo - The user data object.
   * @param {Object} params.messageToSave - The message to be saved in the database.
   * @param {string} params.flowName - The name of the flow to start.
   * @param {Object} [params.extraData] - Additional data to be passed when starting the flow.
   * @returns {Promise<void>}
   */
  async startFlow({ userInfo, messageToSave, flowName, extraData }) {
    if (!(await this.isFlowEnabled(flowName, messageToSave.OrganizationId))) {
      return this.res.status(403).json({ error: "Permission Denied" });
    }
    const trackedFlowId = uuidv4(); //create an ID to track the flow by
    const updatedMessageToSave = {
      ...messageToSave,
      Flow: flowName,
      trackedFlowId,
    }; //add the flow name and ID to the message that will be saved
    const messageData = await this.createMessageData({
      userInfo,
      flowName,
      trackedFlowId,
      flowStep: 1,
      flowSection: 1,
      restarted: false,
    });
    await this.flowManagerService.createNewFlow({ messageData, extraData }); //new flow created in firestore, will be retrieved by `handleExistingFlow` on the next message from the user
    //flow saved to mongoDB
    const extraFields = this.getInitialSurveyQuestion(flowName, messageData);
    await this.databaseService.saveFlow({
      WaId: userInfo.WaId,
      trackedFlowId,
      flowName,
      clientSideTriggered: this.clientSideTriggered,
      organizationPhoneNumber: this.organizationPhoneNumber,
      isReminder: this.isReminder,
      extraFields,
    });

    //HTTP POST request is made to the Flows API (flows/signposting), containing messageData returned from `createMessageData` in the request body
    await this.postRequestService.make_request(
      `flows/${flowName}`,
      messageData
    );
    //message with phone number of the organization saved to the database
    await this.databaseService.saveMessage(
      updatedMessageToSave,
      this.organizationPhoneNumber
    );
    //audio-transcription
    if (updatedMessageToSave.MessageType === "audio") {
      await createTranscriptionTask(
        updatedMessageToSave.MediaUrl0,
        updatedMessageToSave.MessageSid
      );
    }
    this.res.status(204).send();
  }

  /**
   * Starts the signposting flow for the user.
   *
   * @param {Object} userInfo - The data of the user to start the flow for.
   * @param {Object} messageToSave - Message data to be used in the signposting flow.
   *
   * Calls:
   * - `startFlow`: Starts the "signposting" flow with `userSelection` extra data.
   *
   * @returns {Promise<void>} - Resolves when the flow has been started.
   */

  async startAlixSignpostingFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "signposting-alix",
    });
  }

  /**
   * Starts the survey flow for the user.
   *
   * @param {Object} userInfo - The data of the user to start the survey flow for.
   * @param {Object} messageToSave - Message data to be used in the survey flow.
   *
   * Calls:
   * - `startFlow`: Starts the "survey" flow without additional data.
   *
   * @returns {Promise<void>} - Resolves when the survey flow has been started.
   */
  async startFatMacysSurveyFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "survey",
    });
  }

  async startEnhamComboFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "enham-quiz-shelter-moneyhelper",
    });
  }
  async startFMSocialSurveyFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "fm-social-survey",
    });
  }

  async startEnhamVideoDemo(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "enham-ai-video-demo",
    });
  }

  async startEnhamPARegisterFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "enham-pa-register",
    });
  }

  async startEnhamDetailCheckFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "enham-pa-detail-check",
    });
  }

  async startGoldingSignpostingFlow(userInfo, messageToSave) {
    await this.startFlow({
      userInfo,
      messageToSave,
      flowName: "signposting-golding",
    });
  }
  async handleExistingFlow(userInfo, messageToSave) {
    //retrieve current flow from Firestore
    const currentFlow = await this.flowManagerService.getCurrentFlow(
      userInfo,
      this.body.Body,
      this.buttonPayload
    );
    const { flowName, flowStep, id: flowId, restarted } = currentFlow;

    const messageData = await this.createMessageData({
      userInfo,
      flowName,
      trackedFlowId: flowId,
      flowStep,
      restarted,
      flowSection: 1,
    });
    await this.databaseService.updateFlowStatus(flowId, "in_progress");
    // Update flow start time if it's the initial step, the fact that flow step is 2 means that the current message from the user is a response to the flow message that they triggered
    // so we consider that they "officially" begin the flow here
    if (messageData.flowStep === 2 && messageData.flowSection === 1) {
      await this.databaseService.updateFlowStartTime(flowId);
    }
    // Handle flow-specific data updates based on the flow type, these methods are specific to each flow type so for handling any advanced logic you will likely need to add your own
    if (flowName === "survey") {
      await this.databaseService.updateFlowWithResponse(
        flowId,
        this.body.Body,
        this.body.MessageSid
      );
      messageData.cancelSurvey = await this.updateSurveyCancellation(flowId);
      const { flowSection, flowStep } =
        await this.flowManagerService.createNextSectionUpdate({
          WaId: this.body.WaId,
          buttonPayload: this.buttonPayload,
        });
      messageData.flowSection = flowSection;
      messageData.flowStep = flowStep;
      const { questionContent, questionNumber } =
        fatMacysSurveyConfig1?.[flowSection]?.[flowStep] || {};
      if (questionContent && questionNumber) {
        await this.databaseService.updateFlowSurvey(flowId, {
          questionContent,
          questionNumber,
        });
      }
    } else if (flowName === "enham-quiz-shelter-moneyhelper") {
      const { flowSection, flowStep } =
        await this.flowManagerService.createNextSectionUpdate({
          WaId: this.body.WaId,
          buttonPayload: this.buttonPayload,
        });
      messageData.serviceSelection = await this.updateEnhamServiceSelection(
        flowId,
        flowSection,
        flowStep
      );
      if (messageData?.serviceSelection === "training_and_quizzes") {
        await this.databaseService.updateFlowWithResponse(
          flowId,
          this.body.Body,
          this.body.MessageSid
        );
        const { questionContent, questionNumber } =
          enhamPayrollQuizConfig?.[flowSection]?.[flowStep] || {};
        if (questionContent && questionNumber) {
          await this.databaseService.updateFlowSurvey(flowId, {
            questionContent,
            questionNumber,
          });
        }
      }
      messageData.flowSection = flowSection;
      messageData.flowStep = flowStep;
    } else if (flowName === "fm-social-survey") {
      const response = formatFirstSocialSurveyResponse(this.body.Body);
      await this.databaseService.updateFlowWithResponse(
        flowId,
        response,
        this.body.MessageSid
      );
      messageData.cancelSurvey = await this.updateSurveyCancellation(flowId);
      const updatedDoc = await this.flowManagerService.routeSurvey({
        WaId: this.body.WaId,
        userSelection: this.body.Body,
        buttonPayload: this.buttonPayload,
        flowStep,
      });
      messageData.flowStep = updatedDoc.flowStep;
      const { questionContent, questionNumber } =
        fatMacysSurveyConfig2?.[updatedDoc.flowSection]?.[
          updatedDoc.flowStep
        ] || {};
      if (questionContent && questionNumber) {
        await this.databaseService.updateFlowSurvey(flowId, {
          questionContent,
          questionNumber,
        });
      }
    } else if (flowName === "enham-pa-register") {
      await this.databaseService.updateFlowWithResponse(
        flowId,
        this.body.Body,
        this.body.MessageSid
      );
      messageData.cancelSurvey = await this.updateSurveyCancellation(flowId);
      const { flowSection, flowStep } =
        await this.flowManagerService.createNextSectionUpdate({
          WaId: this.body.WaId,
          buttonPayload: this.buttonPayload,
        });
      const { questionContent, questionNumber } =
        enhamPARegisterConfig?.[flowSection]?.[flowStep] || {};
      messageData.flowSection = flowSection;
      messageData.flowStep = flowStep;
      if (questionContent && questionNumber) {
        await this.databaseService.updateFlowSurvey(flowId, {
          questionContent,
          questionNumber,
        });
      }
    } else if (flowName === "enham-pa-detail-check") {
      const { flowSection, flowStep } =
        //TO-DO can probs simplify this
        await this.flowManagerService.createNextSectionUpdate({
          WaId: this.body.WaId,
          buttonPayload: this.buttonPayload,
        });
      messageData.flowSection = flowSection;
      messageData.flowStep = flowStep;
    } else if (flowName === "signposting-golding") {
      const { flowSection, flowStep } =
        await this.flowManagerService.createNextSectionUpdate({
          WaId: this.body.WaId,
          buttonPayload: this.buttonPayload,
        });
      messageData.userSelection = await this.updateSignpostingSelection({
        flowId,
        flowSection,
        flowStep,
      });
      messageData.flowSection = flowSection;
      messageData.flowStep = flowStep;
    } else if (flowName === "signposting-alix") {
      // not DRY but easier to make separate changes if needed
      const { flowSection, flowStep } =
        await this.flowManagerService.createNextSectionUpdate({
          WaId: this.body.WaId,
          buttonPayload: this.buttonPayload,
        });
      messageData.userSelection = await this.updateSignpostingSelection({
        flowId,
        flowSection,
        flowStep,
      });
      messageData.flowSection = flowSection;
      messageData.flowStep = flowStep;
    }
    await this.processFlowResponse({
      flowName,
      messageToSave,
      messageData,
      flowId,
    });
  }

  async updateSignpostingSelection({ flowId, flowSection, flowStep }) {
    const updatedDoc = await this.flowManagerService.updateSignpostingSelection(
      {
        flowId,
        flowSection,
        flowStep,
        selectionValue: this.body.Body,
        buttonPayload: this.buttonPayload,
      }
    );
    console.log("HERE WTF");
    return updatedDoc.userSelection;
  }
  /**
   * Handles survey cancellation based on user input.
   * @param {string} flowId - The unique flow ID.
   * @returns {Promise<string>} - The updated cancellation status.
   */
  async updateSurveyCancellation(flowId) {
    const updatedDoc = await this.flowManagerService.createCancelSurveyUpdate({
      flowId,
      selectionValue: this.buttonPayload,
    });
    return updatedDoc.cancelSurvey;
  }

  /**
   * Handles button selection for the Enham flow
   * @param {string} flowId - The unique flow ID.
   * @returns {Promise<string>} - The updated Enham flow service selection (either ask_questions, quiz or undefined).
   */
  async updateEnhamServiceSelection(flowId) {
    const updatedDoc =
      await this.flowManagerService.createEnhamServiceSelection({
        flowId,
        buttonPayload: this.buttonPayload,
      });
    return updatedDoc?.serviceSelection;
  }
  /**
   * Processes the flow response by making an API request to the flow service.
   * Saves the response and checks if the flow is complete, then saves the message data.
   * @param {Object} params - Parameters for processing the flow response.
   * @param {string} params.flowName - The name of the flow.
   * @param {Object} params.messageToSave - The message data to save.
   * @param {Object} params.messageData - Data to include in the API request.
   * @param {string} params.flowId - The unique flow ID.
   * @returns {Promise<void>}
   */
  async processFlowResponse({ flowName, messageToSave, messageData, flowId }) {
    //HTTP POST request is made to the Flows API, containing messageData returned from `createMessageData` in the request body
    const response = await this.postRequestService.make_request(
      `flows/${flowName}`,
      messageData
    );
    //Flows API sends back flowCompletionStatus in the response body, if true, flow status is set to "completed in Mongo" and deleted from Firestore (deleteFlowOnCompletion)
    if (response.data.flowCompletionStatus) {
      await this.databaseService.updateFlowStatus(flowId, "completed");
      await this.flowManagerService.deleteFlowOnCompletion(flowId);
    }
    //message is updated
    const updatedMessageToSave = {
      ...messageToSave,
      Flow: flowName,
      trackedFlowId: flowId,
    };
    await this.databaseService.saveMessage(
      updatedMessageToSave,
      this.organizationPhoneNumber
    );
    if (updatedMessageToSave.MessageType === "audio") {
      await createTranscriptionTask(
        updatedMessageToSave.MediaUrl0,
        updatedMessageToSave.MessageSid
      );
    }
    this.res.status(204).send();
  }
}

/**
 * Service for sending out outbound flows/messages from the control room.
 * @extends BaseMessageHandler
 */
class OutboundFlowHandler extends BaseMessageHandler {
  /**
   * Creates an instance of OutboundFlowHandler.
   * @param {Object} params - Parameters for the handler.
   * @param {Object} params.req - The HTTP request object.
   * @param {Object} params.res - The HTTP response object.
   * @param {string} params.organizationPhoneNumber - The organization phone number.
   * @param {Object} params.firestore - Firestore database instance.
   * @param {boolean} params.clientSideTriggered - Indicates if the request was triggered from the client side (true for this class).
   * @param {boolean} params.isReminder - Indicates if this is a reminder message.
   */
  constructor({
    req,
    res,
    organizationPhoneNumber,
    firestore,
    clientSideTriggered,
    isReminder,
  }) {
    super({
      req,
      res,
      organizationPhoneNumber,
      firestore,
      clientSideTriggered,
      isReminder,
    });
    this.flow = this.body.flow;
    this.contacts = this.body.contactList;
  }

  async handle() {
    const errors = [];
    const promises = this.contacts.map(async (contact) => {
      try {
        await this.handleBulkMessages(
          contact.WaId,
          contact.ProfileName,
          this.organizationPhoneNumber
        );
      } catch (err) {
        console.error("An error occured", err);
        errors.push(
          `Failed to process message for ${contact.WaId}-${contact.ProfileName}`
        );
      }
    });
    await Promise.all(promises);
    if (errors.length > 0) {
      return this.res.status(500).send("An error occurred processing messages");
    }
    return this.res.status(200).send("Messages processed");
  }
  /**
   * Processes individual messages for a given contact from `contactList` sent from control room in request body.
   * @param {string} WaId - WhatsApp ID of the contact.
   * @param {string} ProfileName - Profile name of the contact.
   * @param {string} organizationPhoneNumber - Organization's phone number.
   * @throws Will throw an error if the flow is not sendable for the organization (configured in database, all information about the flow is sent in request body).
   */
  async handleBulkMessages(WaId, ProfileName, organizationPhoneNumber) {
    const registeredUser = await this.databaseService.getUser(
      WaId,
      organizationPhoneNumber,
      ProfileName
    );

    if (!this.flow.isSendable) {
      throw new Error("Flow not enabled for this organization");
    }
    const userInfo = registeredUser || {
      "WaId": WaId,
      "ProfileName": ProfileName,
    };
    await this.startFlow({ userInfo, flowName: this.flow.flowName });
    console.log(`Message sent to ${userInfo.ProfileName}`);
  }
  /**
   * Initializes a new flow for a given user and flow name.
   * @param {Object} params - The parameters for starting the flow.
   * @param {Object} params.userInfo - Information about the user.
   * @param {string} params.flowName - The name of the flow to start.
   */
  async startFlow({ userInfo, flowName }) {
    const trackedFlowId = uuidv4();
    const messageData = await this.createMessageData({
      userInfo,
      flowName,
      trackedFlowId,
      flowStep: 1,
      flowSection: 1,
    });
    //Here we don't save the message to the database as it is a request sent from the control room, not an inbound user message so this method doesnt call `databaseService.saveMessage`
    await this.databaseService.saveFlow({
      WaId: userInfo.WaId,
      trackedFlowId,
      flowName,
      clientSideTriggered: this.clientSideTriggered,
      isReminder: this.isReminder,
      organizationPhoneNumber: this.organizationPhoneNumber,
    });

    await this.flowManagerService.createNewFlow({ messageData });
    await this.postRequestService.make_request(
      `flows/${flowName}`,
      messageData
    );
  }
}

module.exports = {
  OutboundFlowHandler,
  InboundMessageHandler,
};
