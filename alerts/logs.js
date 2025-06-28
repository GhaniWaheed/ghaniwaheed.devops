const fs = require("fs");
const LOG_FILE = "alert-logs.json";

function logAlert(message) {
  const logs = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"))
    : [];

  logs.unshift({
    message,
    time: new Date().toISOString(),
  });

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs.slice(0, 50), null, 2));
}

function getLogs() {
  if (fs.existsSync(LOG_FILE)) {
    return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
  }
  return [];
}

module.exports = { logAlert, getLogs };
