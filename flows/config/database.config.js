const { MongoClient } = require("mongodb");
async function connectToDB(uri, dbName) {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    console.log(`Connected to ${dbName}`);
    return db;
  } catch (err) {
    console.error(`Failed to connect to ${dbName}:`, err);
    throw err;
  }
}

async function initializeDatabases(app, dbConfig) {
  try {
    const { dbName, dbUri } = dbConfig;
    const controlRoomDB = await connectToDB(dbUri, dbName);
    app.locals.controlRoomDB = controlRoomDB;
    console.log("Databases initialized");
  } catch (err) {
    console.error("Error initializing databases:", err);
    process.exit(1);
  }
}

module.exports = {
  initializeDatabases,
};
