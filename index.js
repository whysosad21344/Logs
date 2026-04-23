const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===== KICK LOG STORE =====
const kicks = [];

// ===== KICK ENDPOINT (DO NOT CHANGE - your system uses this) =====
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

// ===== MARK KICK AS HANDLED =====
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

// ===== READ KICKS =====
app.get("/kicks", (req, res) => {
  res.json({
    success: true,
    data: kicks
  });
});

// ===== CLEAR KICKS =====
app.get("/kicks/clear", (req, res) => {
  kicks.length = 0;
  res.json({
    success: true,
    message: "Kicks cleared"
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
