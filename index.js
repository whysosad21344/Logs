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
    time: Date.now()
  };

  kicks.push(log);

  console.log("🚨 KICK LOG:", log);

  res.json({
    success: true,
    message: "Kick logged"
  });
});

// ===== NEW: READ KICKS ENDPOINT =====
app.get("/kicks", (req, res) => {
  res.json({
    success: true,
    data: kicks
  });
});

// ===== OPTIONAL: CLEAR KICKS (useful later for queue systems) =====
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
