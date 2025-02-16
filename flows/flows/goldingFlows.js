const { BaseFlow } = require("./BaseFlow");
const {
  goldingSignpostingConfig,
} = require("../config/flowResponses/golding.config");
const { signpostingTags } = require("../config/shared.config");
const { createTextMessage } = require("../helpers/messages.helpers");
class GoldingSignpostingFlow extends BaseFlow {
  static FLOW_NAME = "signposting-golding";
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
  async handleFlowStep(flowStep, flowSection) {
    console.log("ok we r here", flowStep, flowSection, this.messageContent);
    let flowCompletionStatus = false;
    if (flowSection === 1 && flowStep === 2) {
      const messageItem = signpostingTags.find(
        (item) => item.buttonId === this.messageContent
      );
      const responseContent = `
Thank you. Please select a further option from: 
${messageItem.messageText}
`;
      const message = createTextMessage({
        waId: this.WaId,
        textContent: responseContent,
        messagingServiceSid: this.messagingServiceSid,
      });
      await this.saveAndSendTextMessage(
        message,
        GoldingSignpostingFlow.FLOW_NAME
      );
    } else {
      const config = goldingSignpostingConfig[flowSection]?.[flowStep];
      if (!config) {
        return flowCompletionStatus;
      }
      const { responseContent, responseType, templateKey } = config;
      if (responseType === "text") {
        const message = createTextMessage({
          waId: this.WaId,
          textContent: responseContent,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          message,
          GoldingSignpostingFlow.FLOW_NAME
        );
      } else if (responseType === "template") {
        await this.saveAndSendTemplateMessage({
          templateKey,
          templateVariables: responseContent,
        });
      }
    }
    return flowCompletionStatus;
  }
}

module.exports = {
  GoldingSignpostingFlow,
};
