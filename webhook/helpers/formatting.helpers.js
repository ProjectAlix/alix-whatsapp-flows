const { fmSocialSurveyDict } = require("../config/flows.config");
function formatFirstSocialSurveyResponse(response) {
  return fmSocialSurveyDict[response] || response;
}

function getNestedField(obj, path) {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}
module.exports = {
  formatFirstSocialSurveyResponse,
  getNestedField,
};
