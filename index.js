const express = require("express");
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads
app.use(compression()); // Compress all responses automatically

// Rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests, please try again later."
});
app.use(limiter);

// In-memory storage for usernames, stats, and guilds
let usersData = {};
let cache = {}; // Simple cache for user data
let latestUpdate = ""; // Variable to store the latest update

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
  const { username } = req.body;
  if (username && !usersData[username]) {
    usersData[username] = {}; // Initialize an empty stats object
    console.log('Received username:', username); // Log the received username
    res.json({
      success: true,
      message: "Data received successfully",
      dateTime: new Date().toISOString()
    });
  } else {
    res.json({
      success: false,
      message: "Username already received or invalid",
      dateTime: new Date().toISOString()
    });
  }
});

/* ---------------- CHECK USERNAME ---------------- */
app.get("/checkusername", (req, res) => {
  const { username } = req.query;

  // Check cache first
  if (cache[username]) {
    return res.json({
      success: true,
      message: `Username ${username} found (cached)`,
      stats: cache[username], // Return cached data
    });
  }

  if (usersData[username]) {
    // Cache the user stats for the next query
    cache[username] = usersData[username].stats;
    return res.json({
      success: true,
      message: `Username ${username} found`,
      stats: usersData[username].stats,
    });
  }

  res.json({
    success: false,
    message: `Username ${username} not found`
  });
});

/* ---------------- CONFIRM USER ---------------- */
app.post("/confirmfound", (req, res) => {
  const { username, stats, currentClan, currentBloodline, hakiColor, equippedTitle, totalBossKills, totalItemDrops, trait, maxHealth, runeEquipped } = req.body;

  if (username && stats) {
    console.log(`Confirmation received: ${username} - ${currentClan}`);

    // Store the stats and other details for the user
    if (!usersData[username]) {
      usersData[username] = {};
    }

    usersData[username].stats = stats;
    usersData[username].currentClan = currentClan;
    usersData[username].currentBloodline = currentBloodline;
    usersData[username].hakiColor = hakiColor;
    usersData[username].equippedTitle = equippedTitle;
    usersData[username].totalBossKills = totalBossKills;
    usersData[username].totalItemDrops = totalItemDrops;
    usersData[username].trait = trait;
    usersData[username].maxHealth = maxHealth;
    usersData[username].runeEquipped = runeEquipped;

    // Return only essential stats back in the response to minimize payload size
    const limitedStats = {
      'Damage %': stats['Damage %'],
      'Crit Chance %': stats['Crit Chance %'],
      'Sword Damage %': stats['Sword Damage %'],
      'Melee Damage %': stats['Melee Damage %'],
      'Luck %': stats['Luck %'],
      'EXP %': stats['EXP %'],
      // You can limit further depending on what data you need
    };

    res.json({
      success: true,
      message: "Stats received successfully",
      dateTime: new Date().toISOString(),
      stats: limitedStats, // Send only essential data
      currentClan,
      currentBloodline,
      hakiColor,
      equippedTitle,
      totalBossKills,
      totalItemDrops,
      trait,
      maxHealth,
      runeEquipped
    });
  } else {
    res.json({
      success: false,
      message: "Invalid username or stats",
      dateTime: new Date().toISOString()
    });
  }
});

/* ---------------- CLEAR USER DATA ---------------- */
app.post("/clearusername", (req, res) => {
  const { username } = req.body;
  if (username && usersData[username]) {
    delete usersData[username]; // Remove user data from memory
    delete cache[username]; // Remove cached data
    res.json({
      success: true,
      message: `Data for ${username} cleared.`
    });
  } else {
    res.json({
      success: false,
      message: `Username ${username} not found or already cleared.`
    });
  }
});

/* ---------------- UPDATE NOTIFY ---------------- */
app.post("/updatenotify", (req, res) => {
  const { updateData } = req.body;
  if (updateData) {
    latestUpdate = updateData;
    res.json({
      success: true,
      message: "Update received successfully",
      dateTime: new Date().toISOString()
    });
  } else {
    res.json({
      success: false,
      message: "No update data received",
      dateTime: new Date().toISOString()
    });
  }
});

/* ---------------- CLEAR UPDATE NOTIFY ---------------- */
app.post("/clearupdatenotify", (req, res) => {
  setTimeout(() => {
    console.log('Clearing update data...');
    latestUpdate = ""; // Clear the update data
    res.json({
      success: true,
      message: "Update data cleared successfully",
      dateTime: new Date().toISOString()
    });
  }, 10000); // Wait 10 seconds before clearing
});

/* ---------------- GET UPDATE ---------------- */
app.get("/updatenotify", (req, res) => {
  res.json({
    success: true,
    updateData: latestUpdate,
    dateTime: new Date().toISOString()
  });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Statcheck server running on port ${PORT}`);
});
