const { runStepBasedFlow2 } = require("../services/samples/runStepBasedFlow2");
const {
  runEditDetailsFlow,
  runEnhamComboFlow,
  runOnboardingFlow,
  runSignpostingFlow,
  runStepBasedFlow,
  runSurveyFlow,
  runFMSocialSurveyFlow,
} = require("../handlers/flowHandlers");
const { ContactModel } = require("../models/ContactModel");

/**
 * Main controller function that directs requests to the appropriate flow handler based on the flowName parameter.
 *
 * @async
 * @function
 * @param {Object} req - Express request object containing request parameters and body data.
 * @param {Object} res - Express response object for sending the flow completion status.
 * @param {function} next - Express middleware next function.
 */
async function flowController(req, res, next) {
  const db = req.app.locals.signpostingOptionsDb; //Database for signposting
  const controlRoomDb = req.app.locals.controlRoomDb; //Main message storage database
  //initialize flow completion status to send back to webhook API
  let flowCompletionStatus;
  try {
    const {
      userInfo,
      organizationPhoneNumber,
      userMessage,
      flowStep,
      startTime,
      flowSection,
      organizationMessagingServiceSid,
      cancelSurvey,
    } = req.body;
    if (process.env.NODE_ENV !== "production") {
      console.log("req body", req.body);
    }
    //get the current flow from request parameters sent from webhook API
    const flow = req.params.flowName;
    //initialize data management class that interacts with a MongoDB database to manage and retrieve contact information, messages, and other related data for a specific organization.
    /**
     * @see {@link ContactModel}
     */
    const contactModel = new ContactModel(
      controlRoomDb,
      startTime,
      organizationPhoneNumber
    );
    if (userMessage.Body === "OPT-OUT") {
      await contactModel.updateContact(userInfo.WaId, { "opted_in": false });
      return res.status(200).send({ flowCompletionStatus: true });
    }
    //create an object that stores all the necessary information utilized by all flows
    const flowConstructorParams = {
      contactModel,
      userInfo,
      flowStep,
      userMessage,
      organizationMessagingServiceSid,
      organizationPhoneNumber,
    };
    //determine function to run based on request params, each function uses the `flowConstructorParams` to initialize the relevant Flow service/handler class
    //To-DO add guard clause to check is flow enabled for organization
    if (flow === "onboarding") {
      flowCompletionStatus = await runOnboardingFlow({
        flowStep,
        flowConstructorParams,
      });
    } else if (flow === "signposting") {
      const userSelection = req.body.userSelection;
      flowCompletionStatus = await runSignpostingFlow({
        db,
        flowConstructorParams,
        flowStep,
        userSelection,
      });
    } else if (flow === "edit-details") {
      const userDetailUpdate = req.body?.userDetailUpdate;
      flowCompletionStatus = await runEditDetailsFlow({
        flowConstructorParams,
        flowStep,
        userDetailUpdate,
      });
    } else if (flow === "survey") {
      flowCompletionStatus = await runSurveyFlow({
        flowConstructorParams,
        flowStep,
        cancelSurvey,
        flowSection,
      });
    } else if (flow === "sample-1") {
      flowCompletionStatus = await runStepBasedFlow({
        flowConstructorParams,
        flowStep,
      });
    } else if (flow == "sample-2") {
      flowCompletionStatus = await runStepBasedFlow2({
        flowConstructorParams,
        flowStep,
        flowName: flow,
      });
    } else if (flow === "fm-social-survey") {
      flowCompletionStatus = await runFMSocialSurveyFlow({
        flowConstructorParams,
        flowStep,
        flowSection,
        cancelSurvey,
      });
    } else if (flow === "enham-quiz-shelter-moneyhelper") {
      const serviceSelection = req.body.serviceSelection;
      const restarted = req.body.restarted;
      flowCompletionStatus = await runEnhamComboFlow({
        flowConstructorParams,
        flowStep,
        flowSection,
        restarted,
        serviceSelection,
      });
    }
    res.status(200).send({ flowCompletionStatus });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports = { flowController };
