const { BaseFlow } = require("./BaseFlow");
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
    console.log("ok we r here", flowStep, flowSection, this.userMessage);
    const flowCompletionStatus = true;
    return flowCompletionStatus;
  }
}

module.exports = {
  GoldingSignpostingFlow,
};
