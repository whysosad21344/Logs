const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true); // ✅ REQUIRED for Render IPs

app.use(express.json()); // To parse incoming JSON payloads

/* ---------------- IP RATE LIMIT + TRACKING ---------------- */

const ipRequests = {};
const MAX_REQUESTS_PER_MINUTE = 60;

function getIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress
  );
}

// Global middleware (runs on ALL routes)
app.use((req, res, next) => {
  const ip = getIP(req);
  const now = Date.now();

  if (!ipRequests[ip]) {
    ipRequests[ip] = {
      count: 0,
      resetTime: now + 60 * 1000
    };
  }

  // reset every minute
  if (now > ipRequests[ip].resetTime) {
    ipRequests[ip].count = 0;
    ipRequests[ip].resetTime = now + 60 * 1000;
  }

  ipRequests[ip].count++;

  console.log(`[REQ] IP: ${ip} | ${req.method} ${req.path}`);

  if (ipRequests[ip].count > MAX_REQUESTS_PER_MINUTE) {
    console.log(`🚫 RATE LIMITED IP: ${ip}`);
    return res.json({
      success: false,
      message: "Too many requests"
    });
  }

  next();
});

/* ---------------- IN-MEMORY STORAGE ---------------- */

let usersData = {};
let guildData = {};
let latestUpdate = "";

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
  const { username } = req.body;

  if (username && !usersData[username]) {
    usersData[username] = {};

    console.log("Received username:", username);

    return res.json({
      success: true,
      message: "Data received successfully",
      dateTime: new Date().toISOString()
    });
  }

  res.json({
    success: false,
    message: "Username already received or invalid",
    dateTime: new Date().toISOString()
  });
});

/* ---------------- CHECK USERNAME ---------------- */
app.get("/checkusername", (req, res) => {
  const { username } = req.query;

  if (usersData[username]) {
    return res.json({
      success: true,
      message: `Username ${username} found`,
      stats: usersData[username],
      dateTime: new Date().toISOString()
    });
  }

  res.json({
    success: false,
    message: `Username ${username} not found`,
    dateTime: new Date().toISOString()
  });
});

/* ---------------- CONFIRM USER ---------------- */
app.post("/confirmfound", (req, res) => {
  const ip = getIP(req); // ✅ IP LOGGING
  console.log("🔥 CONFIRMFOUND FROM IP:", ip);

  const {
    username,
    message,
    stats,
    currentClan,
    currentBloodline,
    hakiColor,
    equippedTitle,
    totalBossKills,
    totalItemDrops,
    trait,
    maxHealth,
    runeEquipped,
    artifacts,
    bounty
  } = req.body;

  if (username && message && stats) {
    console.log(`Confirmation received: ${username} - ${message}`);

    if (!usersData[username]) {
      usersData[username] = {};
    }

    usersData[username] = {
      stats,
      currentClan,
      currentBloodline,
      hakiColor,
      equippedTitle,
      totalBossKills,
      totalItemDrops,
      trait,
      maxHealth,
      runeEquipped,
      artifacts,
      bounty
    };

    console.log("Stats + artifacts received for user:", username);

    console.dir(usersData[username], { depth: null });

    if (artifacts) {
      for (const [slot, item] of Object.entries(artifacts)) {
        console.log(`\n[${slot}]`);
        console.log("Set:", item.set);
        console.log("Rarity:", item.rarity);
        console.log("Level:", item.level);
        console.log("Main Stat:", item.mainStat);

        item.substats?.forEach(s => {
          console.log(` - ${s.stat}: ${s.value}`);
        });
      }
    }

    return res.json({
      success: true,
      message: "Confirmation received",
      dateTime: new Date().toISOString()
    });
  }

  res.json({
    success: false,
    message: "Invalid request",
    dateTime: new Date().toISOString()
  });
});

/* ---------------- CLEAR USER ---------------- */
app.post("/clearusername", (req, res) => {
  const { username } = req.body;

  if (username && usersData[username]) {
    delete usersData[username];

    console.log(`Cleared ${username}`);

    return res.json({
      success: true,
      message: "Cleared"
    });
  }

  res.json({
    success: false,
    message: "Not found"
  });
});

/* ---------------- UPDATE NOTIFY ---------------- */
app.post("/updatenotify", (req, res) => {
  const { updateData } = req.body;

  if (updateData) {
    latestUpdate = updateData;

    console.log("Update received:", updateData);

    return res.json({
      success: true,
      message: "Update stored",
      dateTime: new Date().toISOString()
    });
  }

  res.json({
    success: false,
    message: "No update data"
  });
});

/* ---------------- CLEAR UPDATE ---------------- */
app.post("/clearupdatenotify", (req, res) => {
  setTimeout(() => {
    latestUpdate = "";

    console.log("Update cleared");

    res.json({
      success: true,
      message: "Cleared"
    });
  }, 10000);
});

/* ---------------- GET UPDATE ---------------- */
app.get("/updatenotify", (req, res) => {
  res.json({
    success: true,
    updateData: latestUpdate,
    dateTime: new Date().toISOString()
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Statcheck server running on port ${PORT}`);
});
