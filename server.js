const express = require("express");
const fs = require("fs");
const { spawn } = require("child_process"); // for running index.js
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Run uptime checker (index.js)
const checker = spawn("node", ["index.js"], {
  stdio: "inherit",
  shell: true,
});

// CORS setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// API: Get status
app.get("/api/status", (req, res) => {
  fs.readFile("status.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read status.json" });
    res.json(JSON.parse(data));
  });
});

// API: Get uptime-daily
app.get("/api/uptime-daily", (req, res) => {
  fs.readFile("uptime-daily.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read uptime-daily.json" });
    res.json(JSON.parse(data));
  });
});

// API: Download CSV
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API is running on port ${PORT}`);
});
