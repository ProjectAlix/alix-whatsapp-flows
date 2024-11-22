const { CloudTasksClient } = require("@google-cloud/tasks");
const client = new CloudTasksClient();
const project = process.env.FIREBASE_PROJECT_ID;
const queue = process.env.QUEUE_NAME;
const location = process.env.QUEUE_LOCATION;

const parent = client.queuePath(project, location, queue);
module.exports = {
  parent,
  client,
};
