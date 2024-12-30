const {
  createTextMessage,
  delayMessage,
} = require("../helpers/messages.helpers");
const { matchButtonTextToStoredValue } = require("../helpers/format.helpers");
const { BaseFlow, SurveyBaseFlow } = require("./BaseFlow");
const {
  enhamPayrollQuizConfig,
  enhamDemoConfig,
  enhamPARegistrationConfig,
  enhamPADetailCheckConfig,
} = require("../config/flowResponses.config");
class EnhamComboFlow extends BaseFlow {
  static FLOW_NAME = "enham-quiz-shelter-moneyhelper";
  static SERVICE_OPTIONS = [
    "ask_questions",
    "training_and_quizzes",
    // "documents_sign", add later
  ];
  static SECOND_VIDEO_STEP = 12;
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
  async handleFlowStep(
    flowStep,
    flowSection,
    restarted,
    serviceSelection,
    llmService
  ) {
    console.log(
      serviceSelection === EnhamComboFlow.SERVICE_OPTIONS[1],
      serviceSelection,
      EnhamComboFlow.SERVICE_OPTIONS
    );
    let flowCompletionStatus = false;
    if (flowSection === 1) {
      await this.saveAndSendTemplateMessage({
        templateVariables: {
          greeting: restarted
            ? "Hi again 👋"
            : "Hi there, thanks for messaging Enham :) ",
        },
        templateKey: "enham_start",
      });
    } else if (flowSection === 2) {
      if (serviceSelection === EnhamComboFlow.SERVICE_OPTIONS[0]) {
        if (flowStep === 1) {
          const questionMessage = createTextMessage({
            waId: this.WaId,
            textContent: "What can I help you with?",
            messagingServiceSid: this.messagingServiceSid,
          });
          await this.saveAndSendTextMessage(
            questionMessage,
            EnhamComboFlow.FLOW_NAME
          );
        } else if (flowStep === 2) {
          const aiApiRequest = {
            user_message: this.messageContent,
          };
          const response = await llmService.make_llm_request(
            aiApiRequest,
            "enham-qa"
          );
          const llmAnswer = response.data;
          const answerMessage = createTextMessage({
            waId: this.WaId,
            textContent: llmAnswer,
            messagingServiceSid: this.messagingServiceSid,
          });
          await this.saveAndSendTextMessage(
            answerMessage,
            EnhamComboFlow.FLOW_NAME
          );
          await this.saveAndSendTemplateMessage({
            templateKey: "enham_qa_followup",
            templateVariables: {
              follow_up_question: "Would you like to ask anything else?",
            },
          });
        } else if (flowStep === 3) {
          const endMessage = createTextMessage({
            waId: this.WaId,
            textContent: "Thanks for messaging Enham! 👋",
            messagingServiceSid: this.messagingServiceSid,
          });
          await this.saveAndSendTextMessage(
            endMessage,
            EnhamComboFlow.FLOW_NAME
          );
          flowCompletionStatus = true;
        }
      }
      if (serviceSelection === EnhamComboFlow.SERVICE_OPTIONS[1]) {
        //quiz here
        if (flowStep === 1) {
          const messageTexts = [
            "Welcome to Enham's Direct Payment Agreement! You will watch two videos and answer some questions for us!",
            `Please watch the first 7 Minutes of this video before moving forward to answer the first set of questions.\n\nhttps://www.youtube.com/watch?v=SrGqTLp4qZw`,
          ];
          console.log("should sent msgs");
          const [welcomeMessage, videoMessage] = messageTexts.map((str) =>
            createTextMessage({
              waId: this.WaId,
              textContent: str,
              messagingServiceSid: this.messagingServiceSid,
            })
          );

          await this.saveAndSendTextMessage(
            welcomeMessage,
            EnhamComboFlow.FLOW_NAME
          );
          await this.saveAndSendTextMessage(
            videoMessage,
            EnhamComboFlow.FLOW_NAME //TO-DO check if can remove this
          );
          await this.saveAndSendTemplateMessage({ templateKey: "enhamvideo" });
        } else if (flowStep === EnhamComboFlow.SECOND_VIDEO_STEP) {
          const message = createTextMessage({
            waId: this.WaId,
            textContent:
              "Thanks for answering the first set of questions! Now watch the last part of this video before answering the the second set of questions.\n\nhttps://youtu.be/SrGqTLp4qZw?si=4kzKrvyM0l--5_dM&t=453",
            messagingServiceSid: this.messagingServiceSid,
          });

          await this.saveAndSendTextMessage(message, EnhamComboFlow.FLOW_NAME);

          await this.saveAndSendTemplateMessage({ templateKey: "enhamvideo" });
        } else {
          const { responseContent, responseType, templateKey } =
            enhamPayrollQuizConfig[flowSection][flowStep];
          if (responseType === "text") {
            const message = createTextMessage({
              waId: this.WaId,
              textContent: responseContent,
              messagingServiceSid: this.messagingServiceSid,
            });
            await this.saveAndSendTextMessage(
              message,
              EnhamComboFlow.FLOW_NAME
            );
          } else if (responseType === "template") {
            await this.saveAndSendTemplateMessage({
              templateKey,
              templateVariables: responseContent,
            });
          }
        }
      }
    }
    return flowCompletionStatus;
  }
}

class EnhamVideoDemoFlow extends BaseFlow {
  static FLOW_NAME = "enham-ai-video-demo";
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
    let flowCompletionStatus = false;
    if (flowStep === 1) {
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_ai_video_demo",
      });
    } else if (flowStep === 2) {
      await this.saveAndSendTemplateMessage({
        templateKey: "media",
        templateVariables: {
          templateVariables: "Advisors you can speak with",
          mediaId: "1xZZjde734y2j25fdfq2AvR9K99_RbvLp",
        },
      });
      await delayMessage(7000);
      await this.saveAndSendTemplateMessage({
        templateKey: "demo_options",
        templateVariables: {
          templateVariables:
            "Thanks - please choose who you want to speak with, from A, B, C or D",
        },
      });
    } else {
      const config = enhamDemoConfig[flowSection]?.[flowStep];
      if (!config) {
        // If the config for the given flowSection and flowStep is undefined, return early.
        return flowCompletionStatus;
      }

      const {
        responseContent,
        responseType,
        templateKey,
        buttonTemplateConfig,
      } = config;
      if (responseType === "text") {
        const message = createTextMessage({
          waId: this.WaId,
          textContent: responseContent,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          message,
          EnhamVideoDemoFlow.FLOW_NAME
        );
      } else if (responseType === "template") {
        await this.saveAndSendTemplateMessage({
          templateKey,
          templateVariables: responseContent,
        });
      }
      if (buttonTemplateConfig.sendButtonTemplate) {
        await delayMessage(7000);
        await this.saveAndSendTemplateMessage({
          templateKey: buttonTemplateConfig.buttonTemplateKey,
          templateVariables: buttonTemplateConfig.buttonTemplateContent,
        });
      }
    }
    return flowCompletionStatus;
  }
}

class EnhamPARegisterFlow extends SurveyBaseFlow {
  static FLOW_NAME = "enham-pa-register";
  static LAST_SECTION = 9;
  static LAST_STEP = 1;
  static REGISTRATION_COMPLETION_SECTION = 8;
  static REGISTRATION_COMPLETION_STEP = 1;
  static DAYS_UNTIL_REMINDER = {
    "Monthly basis": 30,
    "Quarterly basis": 90,
  };
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
      await this.saveAndSendTextMessage(message, EnhamPARegisterFlow.FLOW_NAME);
      flowCompletionStatus = true;
      return flowCompletionStatus;
    }
    if (flowStep === 1 && flowSection === 1) {
      //user started a PA registration flow
      if (!this.userInfo?.isEnhamPA) {
        const newRegistrationDoc = {
          isEnhamPA: true,
          EnhamPA_registrationComplete: false,
          EnhamPA_profile: {},
        };
        await this.updateUser(newRegistrationDoc);
      }
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_pa_register_intro",
      });
    } else {
      const config = enhamPARegistrationConfig[flowSection]?.[flowStep];
      if (!config) {
        return flowCompletionStatus;
      }
      if (
        flowStep === EnhamPARegisterFlow.LAST_STEP &&
        flowSection === EnhamPARegisterFlow.LAST_SECTION
      ) {
        flowCompletionStatus = true;
      }
      if (
        flowStep === EnhamPARegisterFlow.REGISTRATION_COMPLETION_STEP &&
        flowSection === EnhamPARegisterFlow.REGISTRATION_COMPLETION_SECTION
      ) {
        const daysUntilReminder =
          EnhamPARegisterFlow.DAYS_UNTIL_REMINDER[this.messageContent];
        const updateDoc = {
          EnhamPA_registrationComplete: true,
          EnhamPA_registrationDate: new Date(),
          EnhamPA_nextDetailCheckDate: new Date(
            Date.now() + daysUntilReminder * 24 * 60 * 60 * 1000
          ),
          EnhamPA_lastDetailCheckDate: null,
        };
        await this.updateUser(updateDoc);
      }
      const {
        responseContent,
        responseType,
        templateKey,
        profileUpdateConfig,
      } = config;
      if (profileUpdateConfig.updateUserProfile) {
        const updatePath = `EnhamPA_profile.${profileUpdateConfig.updateKey}`;
        const updateValue = {
          "object": {
            value: this.messageContent,
            originalMessageSid: this.userMessage.MessageSid,
            lastUpdatedAt: new Date(),
          },
          "array": [
            {
              value: this.messageContent,
              originalMessageSid: this.userMessage.MessageSid,
              createdAt: new Date(),
            },
          ],
        };
        const updateDoc = {
          [profileUpdateConfig.updateKey]:
            updateValue[profileUpdateConfig.fieldType],
        };
        const updateData = {
          updatePath,
          updateDoc,
          updateKey: profileUpdateConfig.updateKey,
        };
        await this.updateUser(updateData, true);
      }
      if (responseType === "text") {
        const message = createTextMessage({
          waId: this.WaId,
          textContent: responseContent,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          message,
          EnhamPARegisterFlow.FLOW_NAME
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

class EnhamDetailCheckFlow extends BaseFlow {
  static DETAIL_CHECK_COMPLETION_SECTION = 6;
  static DETAIL_CHECK_COMPLETION_STEP = 2;
  static FLOW_NAME = "enham-pa-detail-check";
  static NO_UPDATE_BUTTON_PAYLOAD = [
    "default-next_section",
    "no-availability_change",
    "no-postcode_change",
    "no-distance_change",
    "no-extra_update",
  ];
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
    let flowCompletionStatus = false;
    const config = enhamPADetailCheckConfig[flowSection]?.[flowStep] || {};
    const {
      responseContent = null,
      responseType = "text",
      templateKey = "",
      profileUpdateConfig = {},
    } = config;
    if (!this.userInfo.EnhamPA_profile) {
      return flowCompletionStatus;
    }
    const {
      availability_days_times,
      availability_considerations,
      postcode,
      max_travel_distance,
    } = this.userInfo.EnhamPA_profile;
    if (
      flowStep === EnhamDetailCheckFlow.DETAIL_CHECK_COMPLETION_STEP &&
      flowSection === EnhamDetailCheckFlow.DETAIL_CHECK_COMPLETION_SECTION
    ) {
      flowCompletionStatus = true;
      await this.updateUser({ "EnhamPA_lastDetailCheckDate": new Date() });
    }
    if (flowStep === 1 && flowSection === 1) {
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_availability_check_intro",
        templateVariables: {
          username: this.userInfo.ProfileName,
          availability_days_times: availability_days_times.value,
          availability_considerations: availability_considerations[0].value, //TO-DO check if this is acc the latest one
        },
      });
    } else if (flowSection === 3 && flowStep === 1) {
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_postcode_check",
        templateVariables: {
          postcode: postcode.value,
        },
      });
      //ask for the update here dum dum
    } else if (flowSection === 4 && flowStep === 1) {
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_distance_check",
        templateVariables: {
          max_travel_distance: max_travel_distance.value,
        },
      });
    } else if (flowSection === 5 && flowStep === 1) {
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_extra_update",
        templateVariables: {
          templateVariables:
            "Ok thanks for confirming 😊\n\nIs there anything else we should know which might be a new update?",
        },
      });
    } else if (flowSection === 6 && flowStep === 1) {
      await this.saveAndSendTemplateMessage({
        templateKey: "enham_detail_check_end",
        templateVariables: {
          templateVariables:
            "Ok great. Thanks for your help in keeping us up-to-date 😊\n\nWould you like us to check-in on your details again in 1 month, or in 3 months? ",
        },
      });
    } else {
      if (!config) {
        return flowCompletionStatus;
      }
      if (responseType === "text" && responseContent) {
        const message = createTextMessage({
          waId: this.WaId,
          textContent: responseContent,
          messagingServiceSid: this.messagingServiceSid,
        });
        await this.saveAndSendTextMessage(
          message,
          EnhamPARegisterFlow.FLOW_NAME
        );
      } else if (responseType === "template") {
        await this.saveAndSendTemplateMessage({
          templateKey,
          templateVariables: responseContent,
        });
      }
    }
    if (
      profileUpdateConfig.updateUserProfile &&
      !EnhamDetailCheckFlow.NO_UPDATE_BUTTON_PAYLOAD.includes(
        this.buttonPayload
      )
    ) {
      const updatePath = `EnhamPA_profile.${profileUpdateConfig.updateKey}`;
      const parsedMessageContent = matchButtonTextToStoredValue(
        this.messageContent
      );

      if (profileUpdateConfig.updateKey === "availability_check_frequency") {
        const newNextDetailCheckDate = new Date();
        const daysToAdd =
          EnhamPARegisterFlow.DAYS_UNTIL_REMINDER[parsedMessageContent];
        newNextDetailCheckDate.setDate(
          newNextDetailCheckDate.getDate() + daysToAdd
        );
        await this.updateUser({
          "EnhamPA_nextDetailCheckDate": newNextDetailCheckDate,
        });
      }
      const updateValue = {
        "object": {
          value: this.messageContent,
          originalMessageSid: this.userMessage.MessageSid,
          lastUpdatedAt: new Date(),
        },
        "array": [
          {
            value: this.messageContent,
            originalMessageSid: this.userMessage.MessageSid,
            createdAt: new Date(),
          },
        ],
      };
      const updateDoc = {
        [profileUpdateConfig.updateKey]:
          updateValue[profileUpdateConfig.fieldType],
      };

      const updateData = {
        updatePath,
        updateDoc,
        updateKey: profileUpdateConfig.updateKey,
      };

      await this.updateUser(updateData, true);
    }
    return flowCompletionStatus;
  }
}

module.exports = {
  EnhamComboFlow,
  EnhamVideoDemoFlow,
  EnhamPARegisterFlow,
  EnhamDetailCheckFlow,
};
