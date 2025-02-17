const { DatabaseService } = require("../services/DatabaseService");
async function handleStatusCallback(req, res, next) {
  try {
    const body = JSON.parse(JSON.stringify(req.body));
    const { MessageSid, MessageStatus } = body;
    if (!MessageSid || !MessageStatus) {
      const error = new Error(
        "Missing required fields: MessageSid or MessageStatus"
      );
      console.error(error.message);
      return res.status(400).send({ error: error.message });
    }
    const dbService = new DatabaseService(req.app.locals.db);
    if (MessageStatus !== "sent" && MessageStatus !== "queued") {
      console.log(
        `Message status is not queued or sent, message & flow being updated to ${MessageStatus}`
      );
      await dbService.updateMessageStatus(MessageSid, MessageStatus);
    }
    if (MessageStatus === "delivered") {
      console.log("success");
    }
    res.status(200).send("acknowledged");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports = { handleStatusCallback };
