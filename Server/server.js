
// const logFilePath = "https://drive.google.com/file/d/1pPLS_a4CNZCE2mJtRFzIXY6vJgwPvuMQ/view?usp=sharing"

const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(cors());
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const logFilePath = path.join(__dirname, 'log.txt');

// Create the file if it doesn't exist
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
}

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/logs', (req, res) => {
  const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n').slice(-10);
  res.json(logs);
});

wss.on('connection', (ws) => {
  const watcher = fs.watch(logFilePath, (eventType, filename) => {
    if (eventType === 'change') {
      const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n').slice(-10);
      ws.send(JSON.stringify(logs));
    }
  });

  ws.on('close', () => {
    watcher.close();
  });
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});