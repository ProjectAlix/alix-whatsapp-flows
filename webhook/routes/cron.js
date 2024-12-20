const express = require("express");
const router = express.Router();
const cronJobController = require("../controllers/cronJobController");
const {
  buildSurveyReminderRequest,
  buildDetailCheckRequest,
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
  cronJobController.sendSurveyReminder
);

router.post(
  "/scheduled-flow",
  buildDetailCheckRequest,
  cronJobController.sendScheduledFlow
);
module.exports = router;
