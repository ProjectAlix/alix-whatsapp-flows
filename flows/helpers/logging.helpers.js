const fs = require("fs");
const path = require("path");

async function logMessageAsJson(messageContent, customPath) {
  const filePath = customPath || path.join(__dirname, "messages.json");

  try {
    await fs.promises.access(filePath);
  } catch (err) {
    if (err.code === "ENOENT") {
      // File does not exist, create it
      await fs.promises.writeFile(filePath, JSON.stringify([], null, 2));
    } else {
      console.error("Error checking file existence:", err);
      return;
    }
  }

  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const messages = data ? JSON.parse(data) : [];
    messages.push(messageContent);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(messages, null, 2),
      "utf8"
    );
    console.log("Message added to file");
  } catch (err) {
    console.error("Error reading or writing file:", err);
  }
}

module.exports = {
  logMessageAsJson,
};
