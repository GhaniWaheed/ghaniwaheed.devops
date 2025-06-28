const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

// CORS allow karega frontend access ke liye
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// API endpoint
app.get('/api/status', (req, res) => {
  fs.readFile('status.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'File read nahi hui' });
    }
    res.json(JSON.parse(data));
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`API is running: http://localhost:${PORT}`);
});
