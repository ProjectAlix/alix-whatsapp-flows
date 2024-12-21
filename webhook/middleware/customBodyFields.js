const { DatabaseService } = require("../services/DatabaseService");
const buildSurveyReminderRequest = async (req, res, next) => {
  const dbService = new DatabaseService(req.app.locals.db);
  const now = new Date(); // Current date and time
  const reminderTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const flowName = req.body.flowName;
  const { organizationId } = req.query;
  const { flow, contactList } = await dbService.getUnresponsiveContacts(
    flowName,
    reminderTime,
    organizationId
  );
  console.log("flow", flow, "contactList to be sent a reminder", contactList);
  req.body.flow = flow;
  req.body.contactList = contactList;
  req.body.isReminder = true;
  next();
};

const buildScheduledFlowRequest = async (req, res, next) => {
  const dbService = new DatabaseService(req.app.locals.db);
  const now = new Date();
  const flowName = req.body.flowName;
  const { organizationId } = req.query;
  const { flow, contactList } = await dbService.getScheduledContacts(
    flowName,
    now,
    organizationId
  );
  req.body.flow = flow;
  req.body.contactList = contactList;
  req.body.isReminder = false;
  next();
};
module.exports = {
  buildSurveyReminderRequest,
  buildScheduledFlowRequest,
};
