const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===== IN-MEMORY LOG STORE =====
const logs = {
  kicks: [],
  bans: [],
  notifs: []
};

// ===== ROOT CHECK =====
app.get("/", (req, res) => {
  res.send("✅ Render logging server is running!");
});

// ===== TEST ROUTE =====
app.post("/test", (req, res) => {
  console.log("📩 TEST:", req.body);

  res.json({
    success: true,
    received: req.body
  });
});


// =========================
// 🚨 KICK LOGS
// =========================
app.post("/kick", (req, res) => {
  const log = {
    type: "KICK",
    hwid: req.body.hwid,
    user: req.body.user,
    userId: req.body.userId,
    reason: req.body.reason || "None",
    time: Date.now()
  };

  logs.kicks.push(log);

  console.log("🚨 KICK LOG:", log);

  res.json({
    success: true,
    message: "Kick logged"
  });
});


// =========================
// 🔒 BAN LOGS
// =========================
app.post("/ban", (req, res) => {
  const log = {
    type: "BAN",
    hwid: req.body.hwid,
    user: req.body.user,
    userId: req.body.userId,
    reason: req.body.reason || "None",
    time: Date.now()
  };

  logs.bans.push(log);

  console.log("🔒 BAN LOG:", log);

  res.json({
    success: true,
    message: "Ban logged"
  });
});


// =========================
// 🔔 NOTIFICATIONS
// =========================
app.post("/notify", (req, res) => {
  const log = {
    type: "NOTIFY",
    message: req.body.message,
    from: req.body.from || "system",
    time: Date.now()
  };

  logs.notifs.push(log);

  console.log("🔔 NOTIF:", log);

  res.json({
    success: true,
    message: "Notification received"
  });
});


// =========================
// 📜 VIEW LOGS
// =========================
app.get("/logs", (req, res) => {
  res.json(logs);
});


// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
