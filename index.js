const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();
const { sendAlert } = require("./alerts/telegram");

const sites = JSON.parse(fs.readFileSync("websites.json", "utf-8"));
const statusFile = "status.json"; // Output for frontend

function saveStatus(statuses) {
  const timeNow = new Date().toISOString();
  const data = statuses.map((s) => ({
    name: s.name,
    url: s.url,
    status: s.status,
    lastChecked: timeNow,
  }));
  console.log("✅ Saving to status.json", data);
  fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
}

cron.schedule("* * * * *", async () => {
  console.log("🔍 Checking websites...");
  let results = [];

  for (const site of sites) {
    try {
      const res = await axios.get(site.url);
      const isUp = res.status >= 200 && res.status < 400;
      console.log(`✅ ${site.name} is UP`);
      results.push({ ...site, status: isUp ? "UP" : "DOWN" });
    } catch (err) {
      console.log(`❌ ${site.name} is DOWN`);
      results.push({ ...site, status: "DOWN" });
      await sendAlert(`❌ ${site.name} is DOWN! Reason: ${err.message}`);
    }
  }

  saveStatus(results);
});
