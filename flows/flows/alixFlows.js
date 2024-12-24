const {
  createTextMessage,
  createTemplateMessage,
} = require("../helpers/messages.helpers");
const { formatTag } = require("../helpers/format.helpers");
const { sendMessage } = require("../helpers/twilio.helpers");
const { findTemplateSid } = require("../helpers/twilio_account.helpers");
const { BaseFlow } = require("./BaseFlow");

class SignpostingFlow extends BaseFlow {
  static FLOW_NAME = "signposting";
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
    this.signpostingTemplates = {};
  }
  async init() {
    try {
      const template1 = await findTemplateSid("signposting_options_1", false);
      this.signpostingTemplates[1] = {
        templateSid: template1?.templateSid,
        templateName: template1?.templateName,
        templateVariables: {
          greeting:
            "Welcome, please select a category below to see support options",
        },
      };

      const template2 = await findTemplateSid(this.messageContent);
      this.signpostingTemplates[2] = {
        templateSid: template2?.templateSid,
        templateName: template2?.templateName,
        templateVariables: {
          select_further_options:
            "Thank you, please select a further option from the below",
        },
      };

      const template3 = await findTemplateSid("location_choice", false);
      this.signpostingTemplates[3] = {
        templateSid: template3?.templateSid,
        templateName: template3?.templateName,
        templateVariables: {
          location_choice_message:
            "Thank you, would you like to see local options, national options or both?",
        },
      };
    } catch (err) {
      console.error("Error initializing templates:", err);
    }
  }

  async checkUserSelectionError(location, category, supportOptionService) {
    const isValidLocation = [
      "local only",
      "national only",
      "local and national",
    ].includes(location.toLowerCase());
    const validCategories = await supportOptionService.getTags();
    const isValidCategory = validCategories.includes(category);
    if (!isValidCategory || !isValidLocation) {
      return true;
    } else return false;
  }

  async handleFlowStep(
    flowStep,
    userSelection,
    supportOptionService,
    llmService
  ) {
    console.log("user selection:", userSelection);
    let flowCompletionStatus = false;
    if (flowStep <= 3) {
      await this.init();
      const templateSid = this.signpostingTemplates[flowStep]["templateSid"];
      const templateVariables =
        this.signpostingTemplates[flowStep]["templateVariables"];
      const templateName = this.signpostingTemplates[flowStep]["templateName"];
      const templateMessage = createTemplateMessage({
        waId: this.WaId,
        contentSid: templateSid,
        templateVariables,
        messagingServiceSid: this.messagingServiceSid,
      });
      const insertedId = await this.saveResponseMessage({
        message: templateMessage,
        flowName: SignpostingFlow.FLOW_NAME,
        templateName,
      });
      const sid = await sendMessage(templateMessage);
      await this.updateResponse(insertedId, sid);
    }
    if (flowStep >= 4) {
      const { location, category, page, endFlow } = userSelection;
      if (endFlow) {
        const message = this.createEndFlowMessage(this.WaId);
        await this.saveAndSendTextMessage(message, SignpostingFlow.FLOW_NAME);
        flowCompletionStatus = true;
      } else {
        const error = await this.checkUserSelectionError(
          location,
          category,
          supportOptionService
        );
        if (error) {
          flowCompletionStatus = true;
          const errorMessage = await this.createErrorMessage(this.WaId);
          await this.saveAndSendTextMessage(
            errorMessage,
            SignpostingFlow.FLOW_NAME
          );
          return flowCompletionStatus;
        }
        const { postcode, language, region } = this.userInfo;
        const tag = formatTag(category);
        const pageSize = 5;
        const location_choice = location.toLowerCase();
        const dbResult = await supportOptionService.selectOptions({
          tag,
          location: location_choice,
          region,
          page,
          pageSize,
        });
        const { result, remaining } = dbResult;
        if (result.length < 1) {
          flowCompletionStatus = true;
          const message = this.createNoOptionsMessage(this.WaId);
          await this.saveAndSendTextMessage(message, SignpostingFlow.FLOW_NAME);
          return flowCompletionStatus;
        }
        const moreOptionsAvailable = remaining >= 1;
        if (!moreOptionsAvailable) {
          flowCompletionStatus = true;
        }
        const aiApiRequest = {
          options: result,
          postcode: postcode,
          language: language,
          category: category,
        };
        console.log("sent to llm", JSON.stringify(aiApiRequest));
        const response = await llmService.make_llm_request(aiApiRequest); //TO-DO refactor to use some sort of task parameter
        const llmResponse = response.data;
        const firstText = "Here are some support options:";
        const firstMessage = createTextMessage({
          waId: this.WaId,
          textContent: firstText,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          firstMessage,
          SignpostingFlow.FLOW_NAME
        );
        for (const [index, item] of llmResponse.entries()) {
          console.log("sending message:", item);
          const message = createTextMessage({
            waId: this.WaId,
            textContent: item,
            messagingServiceSid: this.messagingServiceSid,
          });
          await this.saveAndSendTextMessage(message, SignpostingFlow.FLOW_NAME);
          if (index === result.length - 1) {
            const { lastMessage, templateName = null } =
              await this.createLastOptionMessage(
                this.WaId,
                moreOptionsAvailable
              );
            const insertedId = await this.saveResponseMessage({
              message: lastMessage,
              flowName: SignpostingFlow.FLOW_NAME,
              templateName,
            });
            const sid = await sendMessage(lastMessage);
            await this.updateResponse(insertedId, sid);
          }
        }
      }
    }
    return flowCompletionStatus;
  }
  async createLastOptionMessage(recipient, moreOptionsAvailable) {
    let lastMessage, searchableTemplateName;
    if (moreOptionsAvailable) {
      const { templateSid, templateName } = await findTemplateSid(
        "see_more_options",
        false
      );
      const templateVariables = {
        see_more_options_message: "Would you like to see more options?",
      };
      lastMessage = createTemplateMessage({
        waId: recipient,
        contentSid: templateSid,
        templateVariables,
        messagingServiceSid: this.messagingServiceSid,
      });
      searchableTemplateName = templateName;
    } else {
      const text =
        "Thanks for using the service just now, please text 'hi' to search again";
      lastMessage = createTextMessage({
        waId: recipient,
        textContent: text,
        messagingServiceSid: this.messagingServiceSid,
      });
    }
    return { templateName: searchableTemplateName, lastMessage };
  }
  createEndFlowMessage(recipient) {
    const text =
      "Thanks for using the service just now, please text 'hi' to search again";
    const message = createTextMessage({
      waId: recipient,
      textContent: text,
      messagingServiceSid: this.messagingServiceSid,
    });
    return message;
  }
  createNoOptionsMessage(recipient) {
    const text =
      "There seems to be nothing in our database for your search right now, please text 'hi' to start a new search";
    const message = createTextMessage({
      waId: recipient,
      textContent: text,
      messagingServiceSid: this.messagingServiceSid,
    });
    return message;
  }
}

module.exports = {
  SignpostingFlow,
};
