const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// lets us read JSON from Roblox
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Render is working!");
});

// test endpoint for Roblox
app.post("/test", (req, res) => {
  console.log("📩 Got data from Roblox:", req.body);

  res.json({
    success: true,
    received: req.body
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
