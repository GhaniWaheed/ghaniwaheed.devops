const { logAlert } = require("./logs");

async function sendAlert(message) {
  logAlert(message); // sirf local log
  console.log("🔔 Alert (locally logged):", message);
}

module.exports = { sendAlert };

