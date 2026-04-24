const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const kicks = [];
const notifications = [];

/* ---------------- KICKS ---------------- */

app.post("/kick", (req, res) => {
  const log = {
    hwid: req.body.hwid || null,
    username: req.body.username || null,
    reason: req.body.reason,
    time: Date.now(),
    handled: false
  };

  kicks.push(log);

  console.log("🚨 KICK LOG:", log);

  res.json({
    success: true,
    message: "Kick logged"
  });
});

app.post("/kick/handled", (req, res) => {
  const hwid = req.body.hwid;
  const username = req.body.username;

  for (let log of kicks) {
    if (
      (hwid && log.hwid === hwid) ||
      (username && log.username === username)
    ) {
      log.handled = true;
    }
  }

  res.json({
    success: true,
    message: "Marked as handled"
  });
});

app.get("/kicks", (req, res) => {
  res.json({
    success: true,
    data: kicks
  });
});

app.get("/kicks/clear", (req, res) => {
  kicks.length = 0;

  res.json({
    success: true,
    message: "Kicks cleared"
  });
});

/* ---------------- NOTIFICATIONS ---------------- */

app.post("/notify", (req, res) => {
  const log = {
    text: req.body.text,
    hwid: req.body.hwid || null,
    username: req.body.username || null,
    time: Date.now(),
    readBy: []
  };

  notifications.push(log);

  console.log("📢 NOTIFY LOG:", log);

  res.json({
    success: true,
    message: "Notification logged"
  });
});

app.get("/notify", (req, res) => {
  const hwid = req.query.hwid;
  const username = req.query.username;

  const filtered = notifications.filter(log => {
    return (
      (!log.hwid && !log.username) || // global
      (hwid && log.hwid === hwid) ||
      (username && log.username === username)
    );
  });

  const unread = filtered.filter(log => {
    return !log.readBy.includes(hwid || username);
  });

  res.json({
    success: true,
    data: unread
  });
});

app.post("/notify/read", (req, res) => {
  const time = req.body.time;
  const hwid = req.body.hwid;
  const username = req.body.username;

  const readerId = hwid || username;

  for (let log of notifications) {
    if (log.time === time) {
      if (!log.readBy.includes(readerId)) {
        log.readBy.push(readerId);
      }
    }
  }

  res.json({
    success: true,
    message: "Notification marked as read for user"
  });
});

app.get("/notify/clear", (req, res) => {
  notifications.length = 0;

  res.json({
    success: true,
    message: "Notifications cleared"
  });
});

/* ---------------- START ---------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
