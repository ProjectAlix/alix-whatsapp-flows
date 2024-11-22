const { BaseFlow } = require("../BaseFlow");
const { createTextMessage } = require("../../helpers/messages.helpers");
class StepBasedFlow extends BaseFlow {
  static FLOW_NAME = "sample-1";
  /**
   * Creates an instance of the StepBasedFlow class (a sample/demo flow ).
   *
   * @constructor
   * @param {Object} params - Parameters for initializing the StepBasedFlow.
   * @param {Object} params.userInfo - Information about the user interacting with the flow.
   * @param {Object} params.userMessage - The incoming message from the user.
   * @param {Object} params.contactModel - The contact model for managing contact data.
   * @param {string} params.organizationPhoneNumber - The organization's phone number.
   * @param {string} params.organizationMessagingServiceSid - The messaging service SID for the organization.
   */
  constructor({
    userInfo,
    userMessage,
    contactModel,
    organizationPhoneNumber,
    organizationMessagingServiceSid,
  }) {
    super({
      userInfo,
      userMessage,
      contactModel,
      organizationPhoneNumber,
      organizationMessagingServiceSid,
    });
  }

  /**
   * Handles the flow step logic based on the provided flow step number.
   * Sends messages or templates to the user based on the flow step.
   *
   * @async
   * @param {number} flowStep - The current step in the flow.
   * @returns {Promise<boolean>} Resolves to true if the flow is completed, otherwise false.
   */
  async handleFlowStep(flowStep) {
    let flowCompletionStatus = false;
    if (flowStep === 5) {
      const text = "This is the end of the flow!";
      const textMessage = createTextMessage({
        waId: this.WaId,
        textContent: text,
        messagingServiceSid: this.messagingServiceSid,
      });
      await this.saveAndSendTextMessage(textMessage, StepBasedFlow.FLOW_NAME);
      flowCompletionStatus = true;
      return flowCompletionStatus;
    }
    if (flowStep >= 2) {
      const text = `The current flow step is ${flowStep}`;
      const textMessage = createTextMessage({
        waId: this.WaId,
        textContent: text,
        messagingServiceSid: this.messagingServiceSid,
      });
      await this.saveAndSendTextMessage(textMessage, StepBasedFlow.FLOW_NAME);
    } else {
      await this.saveAndSendTemplateMessage({ templateKey: "sample_message" });
    }
    return flowCompletionStatus;
  }
}

module.exports = {
  StepBasedFlow,
};
