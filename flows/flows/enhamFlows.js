const { createTextMessage } = require("../helpers/messages.helpers");
const { BaseFlow } = require("./BaseFlow");
const { enhamPayrollQuizConfig } = require("../config/flowResponses.config");
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

module.exports = {
  EnhamComboFlow,
};
