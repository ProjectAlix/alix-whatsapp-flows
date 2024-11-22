const createTextMessage = ({ waId, textContent, messagingServiceSid }) => {
  const message = {
    from: messagingServiceSid,
    body: textContent,
    to: `whatsapp:+${waId}`,
  };
  console.log("to save", message);
  return message;
};

const createTemplateMessage = ({
  waId,
  contentSid,
  templateVariables,
  messagingServiceSid,
}) => {
  const message = {
    from: messagingServiceSid,
    contentSid: contentSid,
    contentVariables: JSON.stringify(templateVariables),
    to: `whatsapp:+${waId}`,
    // messagingServiceSid: messagingServiceSid,
  };

  console.log("to save", message);
  return message;
};
module.exports = {
  createTextMessage,
  createTemplateMessage,
};
