const { transcription_api_base } = require("../config/api_base.config");
const { parent, client } = require("../config/cloud_tasks.config");

async function createTranscriptionTask(MediaUrl0, MessageSid) {
  const url = `${transcription_api_base}tasks/transcription`;
  const task = {
    httpRequest: {
      httpMethod: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: Buffer.from(JSON.stringify({ MediaUrl0, MessageSid })).toString(
        "base64"
      ),
    },
  };
  const request = { parent, task };
  const [response] = await client.createTask(request);
  console.log(`Created task ${response.name}`);
}

module.exports = {
  createTranscriptionTask,
};
