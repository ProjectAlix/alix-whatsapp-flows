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
  async handleFlowStep({
    flowStep,
    flowSection,
    userSelection,
    signpostingService,
  }) {
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
    } else if (flowSection === 1 && flowStep === 4) {
      const { page, category_1, category_2, location } = userSelection;
      const options = await signpostingService.selectOptions({
        category1Value: category_1,
        category2Value: category_2,
        location,
        page,
      });
      if (options.length > 0) {
        const firstText = "Here are some support options:";
        const firstMessage = createTextMessage({
          waId: this.WaId,
          textContent: firstText,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          firstMessage,
          GoldingSignpostingFlow.FLOW_NAME
        );
        const texts = options.map((option) => option.name);
        // send to LLM here
        for (const text of texts) {
          const message = createTextMessage({
            waId: this.WaId,
            textContent: text,
            messagingServiceSid: this.messagingServiceSid,
          });
          await this.saveAndSendTextMessage(
            message,
            GoldingSignpostingFlow.FLOW_NAME
          );
        }
      }
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
