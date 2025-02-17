const alixSignpostingConfig = {
  1: {
    1: {
      responseContent: {
        templateVariables:
          "Welcome, please select a category to see support options",
      },
      responseType: "template",
      templateKey: "signposting_intro",
    },
    3: {
      responseContent: {
        templateVariables:
          "Thank you. Would you like to see local options, national options or both?",
      },
      responseType: "template",
      templateKey: "signposting_location_choice",
    },
  },
};

module.exports = {
  alixSignpostingConfig,
};
