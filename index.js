const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const kicks = [];
const notifications = [];

app.post("/kick", (req, res) => {
  const log = {
    hwid: req.body.hwid,
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

  for (let log of kicks) {
    if (log.hwid === hwid) {
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

app.post("/notify", (req, res) => {
  const log = {
    text: req.body.text,
    time: Date.now(),
    read: false
  };

  notifications.push(log);

  console.log("📢 NOTIFY LOG:", log);

  res.json({
    success: true,
    message: "Notification logged"
  });
});

app.post("/notify/read", (req, res) => {
  const time = req.body.time;

  for (let log of notifications) {
    if (log.time === time) {
      log.read = true;
    }
  }

  res.json({
    success: true,
    message: "Notification marked as read"
  });
});

app.get("/notify", (req, res) => {
  res.json({
    success: true,
    data: notifications
  });
});

app.get("/notify/clear", (req, res) => {
  notifications.length = 0;

  res.json({
    success: true,
    message: "Notifications cleared"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
