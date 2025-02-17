const { BaseFlow } = require("./BaseFlow");
const {
  goldingSignpostingConfig,
} = require("../config/flowResponses/golding.config");
const { signpostingTags } = require("../config/shared.config");
const {
  createTextMessage,
  delayMessage,
} = require("../helpers/messages.helpers");
class GoldingSignpostingFlow extends BaseFlow {
  static FLOW_NAME = "signposting-golding";
  static LAST_STEP = 5;
  static LAST_SECTION = 1;
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
    llmService,
  }) {
    console.log("ok we r here", flowStep, flowSection, this.messageContent);
    let flowCompletionStatus = false;
    if (
      flowSection === GoldingSignpostingFlow.LAST_SECTION &&
      flowStep === GoldingSignpostingFlow.LAST_STEP
    ) {
      const lastText =
        "Thanks for using the service just now. Please message 'hi' to search again.";
      const message = createTextMessage({
        waId: this.waId,
        textContent: lastText,
        messagingServiceSid: this.messagingServiceSid,
      });
      await this.saveAndSendTextMessage(
        message,
        GoldingSignpostingFlow.FLOW_NAME
      );
    }
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
      const { options, totalCount, remainingCount } =
        await signpostingService.selectOptions({
          category1Value: category_1,
          category2Value: category_2,
          location,
          page,
        });
      console.log(totalCount, remainingCount);
      if (options.length === 0) {
        const firstText =
          "There seems to be nothing in our database for your search. Please message 'hi' to search again";
        const firstMessage = createTextMessage({
          waId: this.WaId,
          textContent: firstText,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          firstMessage,
          GoldingSignpostingFlow.FLOW_NAME
        );
      }
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
        // send to llm here
        let texts = options.map(
          (option) =>
            `${option.name}\n${option.description_short}\nLocation:${
              option.location_scope === "local"
                ? option.postcode
                : option.area_covered
            }\nWebsite:${option.external_url}"`
        ); // in case theres an error in LLM response
        const aiAPIRequest = {
          options,
          category: category_2,
          language: "en", //default for now TO-DO add translation
        };
        const response = await llmService.makeLLMRequest(
          aiAPIRequest,
          GoldingSignpostingFlow.FLOW_NAME
        );
        const LLMProcessedMessages = response.data?.data;
        if (LLMProcessedMessages && LLMProcessedMessages.length > 0) {
          texts = LLMProcessedMessages;
        }
        for (const text of texts) {
          const message = createTextMessage({
            waId: this.WaId,
            textContent: text,
            messagingServiceSid: this.messagingServiceSid,
          });
          await delayMessage(3000);
          await this.saveAndSendTextMessage(
            message,
            GoldingSignpostingFlow.FLOW_NAME
          );
        }
        if (remainingCount > 0) {
          await this.saveAndSendTemplateMessage({
            templateKey: "signposting_see_more_options",
            templateVariables: {
              templateVariables: "Would you like to see more options?",
            },
          });
        } else {
          const lastText =
            "Thanks for using the service just now. Please message 'hi' to search again.";
          const message = createTextMessage({
            waId: this.WaId,
            textContent: lastText,
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
