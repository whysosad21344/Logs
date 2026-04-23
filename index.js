const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===== KICK LOG STORE =====
const kicks = [];

// ===== KICK ENDPOINT =====
app.post("/kick", (req, res) => {
  const log = {
    hwid: req.body.hwid,
    time: Date.now()
  };

  kicks.push(log);

  console.log("🚨 KICK LOG:", log);

  res.json({
    success: true,
    message: "Kick logged"
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
