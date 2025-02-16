const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const axios = require("axios");
const { convertTemplateName } = require("./format.helpers");
async function listTemplates() {
  const auth = {
    username: accountSid,
    password: authToken,
  };

  const response = await axios.get(
    "https://content.twilio.com/v1/Content?PageSize=100",
    {
      auth,
    }
  );
  return response.data;
}

async function findTemplateSid(templateName, convertTemplate = true) {
  try {
    const templates = await listTemplates();
    console.log(
      templates.contents.find(
        (tmpl) => tmpl.friendly_name == "signposting_options_1"
      )
    );
    const searchableTemplateName = convertTemplate
      ? convertTemplateName(templateName)
      : templateName;

    const foundTemplate = templates.contents.find(
      (template) => template.friendly_name === searchableTemplateName
    );
    if (foundTemplate) {
      return {
        templateSid: foundTemplate.sid,
        templateName: searchableTemplateName,
      };
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  findTemplateSid,
  listTemplates,
};
