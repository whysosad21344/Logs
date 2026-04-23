const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const kicks = [];
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
