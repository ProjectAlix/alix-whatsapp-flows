function formatTag(str) {
  return "#" + str.replace(/ /g, "-");
}

function convertTemplateName(templateName) {
  // Convert string to lowercase
  let result = templateName.toLowerCase();

  // Replace spaces with underscores
  result = result.replace(/\s+/g, "_");

  // Remove non-alphanumeric characters except underscores
  result = result.replace(/[^\w\s]/gi, "");

  // Remove any trailing underscores
  result = result.replace(/_+$/, "");
  return result;
}

function formatContact(contact) {
  return contact.replace("whatsapp:+", "");
}

function formatButtonId(buttonPayload) {
  const splitId = buttonPayload.split("_");
  return {
    flowName: splitId[0],
    flowStep: splitId[1],
  };
}
function matchMonthlyButtonText(messageContent) {
  const buttonTextMap = {
    "1 month please": "Monthly basis",
    "3 months please": "Quarterly basis",
  };
  return buttonTextMap[messageContent];
}
module.exports = {
  formatTag,
  convertTemplateName,
  formatContact,
  formatButtonId,
  matchMonthlyButtonText,
};
