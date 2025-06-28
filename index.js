const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();

const sites = JSON.parse(fs.readFileSync("websites.json", "utf-8"));
const statusFile = "status.json";
const dailyFile = "uptime-daily.json";

function saveStatus(statuses) {
  const timeNow = new Date().toISOString();
  const data = statuses.map((s) => ({
    name: s.name,
    url: s.url,
    status: s.status,
    responseTime: s.responseTime,
    lastChecked: timeNow,
  }));
  fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
}

function updateDailyUptime(statuses) {
  let daily = {};
  if (fs.existsSync(dailyFile)) {
    daily = JSON.parse(fs.readFileSync(dailyFile, "utf-8"));
  }

  const today = new Date().toISOString().slice(0, 10);

  statuses.forEach((site) => {
    if (!daily[site.name]) daily[site.name] = {};
    if (!daily[site.name][today]) daily[site.name][today] = { up: 0, total: 0 };

    daily[site.name][today].total += 1;
    if (site.status === "UP") {
      daily[site.name][today].up += 1;
    }
  });

  fs.writeFileSync(dailyFile, JSON.stringify(daily, null, 2));
}

cron.schedule("*/1 * * * * *", async () => {
  console.log("🔍 Checking websites...");
  let results = [];

  for (const site of sites) {
    try {
      const start = Date.now();
      const res = await axios.get(site.url);
      const ms = Date.now() - start;
      const isUp = res.status >= 200 && res.status < 400;
      results.push({ ...site, status: isUp ? "UP" : "DOWN", responseTime: ms });
    } catch (err) {
      results.push({ ...site, status: "DOWN", responseTime: null });
    }
  }

  saveStatus(results);
  updateDailyUptime(results);
});
