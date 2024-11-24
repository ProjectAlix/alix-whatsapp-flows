const { fmSocialSurveyDict } = require("../config/survey.config");
function formatFirstSocialSurveyResponse(response) {
  return fmSocialSurveyDict[response] || response;
}

module.exports = {
  formatFirstSocialSurveyResponse,
};
