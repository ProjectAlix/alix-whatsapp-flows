const { createTextMessage } = require("../helpers/messages.helpers");
const { SurveyBaseFlow } = require("./BaseFlow");
const {
  fatMacysSurveyConfig1,
  fatMacysSurveyConfig2,
} = require("../config/flowResponses/fm.config");
class FatMacysSurveyFlow extends SurveyBaseFlow {
  static FLOW_NAME = "survey";
  static LAST_SECTION = 7;
  static LAST_STEP = 6;
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
  async handleFlowStep(flowStep, flowSection, cancelSurvey) {
    let flowCompletionStatus = false;
    if (cancelSurvey) {
      const message = this.createCancellationMessage(this.WaId);
      await this.saveAndSendTextMessage(message, FatMacysSurveyFlow.FLOW_NAME);
      flowCompletionStatus = true;
      return flowCompletionStatus;
    }
    if (flowStep === 1 && flowSection === 1) {
      this.userMessage?.isReminder
        ? await this.saveAndSendTemplateMessage({
            templateKey: "survey_reminder",
          })
        : await this.saveAndSendTemplateMessage({
            templateKey: "survey_intro",
          });
    } else {
      const { responseContent, responseType, templateKey } =
        fatMacysSurveyConfig1[flowSection][flowStep];
      if (
        flowStep === FatMacysSurveyFlow.LAST_STEP &&
        flowSection === FatMacysSurveyFlow.LAST_SECTION
      ) {
        flowCompletionStatus = true;
      }
      console.log("full user message passed in", this.userMessage);
      console.log(
        "current flow step passed in:",
        flowStep,
        "current flow section passed in:",
        flowSection,
        "message content:",
        this.messageContent
      );
      if (flowSection === 1 && flowStep === 4) {
        const shareName = this.buttonPayload.split("-")[0] === "sharename";
        const nameUpdate = {
          ProfileName: shareName ? undefined : "Anon",
          username: shareName ? undefined : "Anon",
          isAnon: shareName ? false : true,
        };
        await this.updateUser(nameUpdate);
      }
      if (flowSection === 2 && flowStep === 1) {
        const isContactable = this.buttonPayload.split("-")[0] === "followup";
        console.log("user is contactable", isContactable);
        const updateData = {
          isContactable,
        };
        await this.updateUser(updateData);
      }
      if (responseType === "text") {
        const message = createTextMessage({
          waId: this.WaId,
          textContent: responseContent,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          message,
          FatMacysSurveyFlow.FLOW_NAME
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

class FMSocialSurveyFlow extends SurveyBaseFlow {
  static FLOW_NAME = "fm-social-survey";
  static LAST_STEPS = [9, 10];
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
  async handleFlowStep(flowStep, flowSection, cancelSurvey) {
    let flowCompletionStatus = false;
    if (cancelSurvey) {
      const message = this.createCancellationMessage(this.WaId);
      await this.saveAndSendTextMessage(message, FMSocialSurveyFlow.FLOW_NAME);
      flowCompletionStatus = true;
      return flowCompletionStatus;
    }
    if (flowStep === 1) {
      this.userMessage?.isReminder
        ? await this.saveAndSendTemplateMessage({
            templateKey: "survey_reminder",
          })
        : await this.saveAndSendTemplateMessage({
            templateKey: "fm_social_survey_intro",
          });
    } else {
      const { responseContent, responseType, templateKey } =
        fatMacysSurveyConfig2[flowSection][flowStep];
      if (FMSocialSurveyFlow.LAST_STEPS.includes(flowStep)) {
        flowCompletionStatus = true;
      }
      if (responseType === "text") {
        const message = createTextMessage({
          waId: this.WaId,
          textContent: responseContent,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          message,
          FMSocialSurveyFlow.FLOW_NAME
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
  FMSocialSurveyFlow,
  FatMacysSurveyFlow,
};
