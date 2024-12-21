const { firestore } = require("../config/firestore.config");
const { OutboundFlowHandler } = require("../handlers/MessageHandlers");
const sendSurveyReminder = async (req, res, next) => {
  //add flow and contactList to req body in middleware
  const messageHandler = new OutboundFlowHandler({
    req,
    res,
    organizationPhoneNumber: req.body.organizationPhoneNumber,
    firestore,
    clientSideTriggered: false,
    isReminder: true,
  });
  if (process.env.NODE_ENV !== "production") {
    return res
      .status(200)
      .json({ message: "Messages would be sent successfully" });
  }
  await messageHandler.handle();
};

const sendScheduledFlow = async (req, res, next) => {
  const messageHandler = new OutboundFlowHandler({
    req,
    res,
    organizationPhoneNumber: req.body.organizationPhoneNumber,
    firestore,
    clientSideTriggered: false,
    isReminder: false,
  });
  await messageHandler.handle();
};
module.exports = {
  sendSurveyReminder,
  sendScheduledFlow,
};
