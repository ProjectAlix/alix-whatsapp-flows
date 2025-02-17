const express = require("express");
const router = express.Router();
const cronJobController = require("../controllers/cronJobController");
const {
  buildSurveyReminderRequest,
  buildScheduledFlowRequest,
} = require("../middleware/customBodyFields");
//cron job needs to send
/*
{
    "organizationPhoneNumber": "whatsapp:+442078705932",
    "flowName":"survey"
} and organizationId in query params
*/
router.post(
  "/survey-reminder",
  buildSurveyReminderRequest,
  cronJobController.processOutboundFlow
);

router.post(
  "/scheduled-flow",
  buildScheduledFlowRequest,
  cronJobController.processOutboundFlow
);
module.exports = router;
