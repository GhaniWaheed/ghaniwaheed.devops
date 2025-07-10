const express = require("express");
const fs = require("fs");
const { spawn } = require("child_process"); // ✅ Sirf ek dafa

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Run index.js in background
spawn("node", ["index.js"], {
  stdio: "inherit",
  shell: true,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/status", (req, res) => {
  fs.readFile("status.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read status.json" });
    res.json(JSON.parse(data));
  });
});

app.get("/api/uptime-daily", (req, res) => {
  fs.readFile("uptime-daily.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read uptime-daily.json" });
    res.json(JSON.parse(data));
  });
});

app.get("/api/download-csv", (req, res) => {
  fs.readFile("status.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Failed to read data");

    const jsonData = JSON.parse(data);
    const csv = ["Name,URL,Status,ResponseTime,LastChecked"];
    jsonData.forEach(item => {
      csv.push(`${item.name},${item.url},${item.status},${item.responseTime || 'N/A'},${item.lastChecked}`);
    });

    res.setHeader("Content-disposition", "attachment; filename=status.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv.join("\n"));
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API is running on port ${PORT}`);
});
