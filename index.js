const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames, stats, and guilds
let usersData = {};
let guildData = {}; // New in-memory storage for guild data
let latestUpdate = ""; // Variable to store the latest update


// Global table (always exists while server is running)
let linkedUsers = [];

/* ---------------- POST: ADD USER ---------------- */
app.post("/linking", (req, res) => {
  console.log("📩 POST /linking received:");
  console.log(req.body);

  const { username, code } = req.body; // ✅ added code

  if (!username || !code) {
    return res.json({
      success: false,
      message: "Missing username or code",
      dateTime: new Date().toISOString()
    });
  }

  // prevent duplicates (update code if exists)
  const existing = linkedUsers.find(u => u.username === username);

  if (!existing) {
    linkedUsers.push({ username, code }); // ✅ added code storage
  } else {
    existing.code = code;
  }

  console.log("📌 Linked Users Table:");
  console.log(linkedUsers);

  res.json({
    success: true,
    message: "Username stored",
    total: linkedUsers.length,
    dateTime: new Date().toISOString()
  });
});

/* ---------------- GET: VIEW USERS ---------------- */
app.get("/linking", (req, res) => {
  console.log("📩 GET /linking received:");
  console.log(req.query);

  if (!req.headers.accept || req.headers.accept.includes("text/html")) {

    let html = `
    <html>
      <head>
        <title>Linked Users</title>
        <style>
          body {
            font-family: Arial;
            background: #0f0f0f;
            color: #ffffff;
            padding: 20px;
          }
          h1 { color: #00ffcc; }
          table {
            width: 60%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #333;
            padding: 10px;
            text-align: left;
          }
          th { background: #222; }
          tr:nth-child(even) { background: #1a1a1a; }
        </style>
      </head>
      <body>
        <h1>Linked Users (${linkedUsers.length})</h1>

        <table>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Code</th> <!-- ✅ added -->
          </tr>
    `;

    linkedUsers.forEach((user, i) => {
      html += `
        <tr>
          <td>${i + 1}</td>
          <td>${user.username}</td>
          <td>${user.code}</td>
        </tr>
      `;
    });

    html += `
        </table>
      </body>
    </html>
    `;

    return res.send(html);
  }

  res.json({
    success: true,
    users: linkedUsers,
    total: linkedUsers.length,
    query: req.query,
    dateTime: new Date().toISOString()
  });
});

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
  const { username } = req.body;

  if (username && !usersData[username]) {
    usersData[username] = {};
    console.log('Received username:', username);

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

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
  const { username } = req.body; // Extract the username from the request body
  if (username && !usersData[username]) {
    usersData[username] = {}; // Initialize an empty stats object for this username
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
  const { username } = req.query; // Get the username from the query string
  if (usersData[username]) {
    res.json({
      success: true,
      message: `Username ${username} found`,
      stats: usersData[username], // Send the stats for the found username
      dateTime: new Date().toISOString() // Include current date and time
    });
  } else {
    res.json({
      success: false,
      message: `Username ${username} not found`,
      dateTime: new Date().toISOString() // Include current date and time
    });
  }
});

/* ---------------- CONFIRM USER ---------------- */
app.post("/confirmfound", (req, res) => {
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

    // ✅ FULL DEEP LOG (fixes [Object]/[Array])
    console.dir(usersData[username], { depth: null });

    // OPTIONAL: cleaner artifact-only log
    if (artifacts) {
      for (const [slot, item] of Object.entries(artifacts)) {
        console.log(`\n[${slot}]`);
        console.log("Set:", item.set);
        console.log("Rarity:", item.rarity);
        console.log("Level:", item.level);

        console.log("Main Stat:", item.mainStat);

        console.log("Substats:");
        item.substats?.forEach(s => {
          console.log(` - ${s.stat}: ${s.value}`);
        });
      }
    }

    return res.json({
      success: true,
      message: "Confirmation and stats received successfully",
      dateTime: new Date().toISOString(),

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
      bounty,
      artifacts
    });
  }

  res.json({
    success: false,
    message: "Invalid username, message, or stats",
    dateTime: new Date().toISOString(),
  });
});

/* ---------------- CLEAR USER DATA ---------------- */
app.post("/clearusername", (req, res) => {
  const { username } = req.body; // Extract the username from the request body
  if (username && usersData[username]) {
    delete usersData[username];
    console.log(`Data and stats for ${username} cleared from server.`);
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
  const { updateData } = req.body; // Extract the update data from the request body
  if (updateData) {
    console.log('Received update:', updateData);
    latestUpdate = updateData; // Store the latest update
    res.json({
      success: true,
      message: "Update received successfully",
      dateTime: new Date().toISOString() // Include current date and time
    });
  } else {
    res.json({
      success: false,
      message: "No update data received",
      dateTime: new Date().toISOString() // Include current date and time
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
      dateTime: new Date().toISOString() // Include current date and time
    });
  }, 10000); // Wait 10 seconds before clearing
});

/* ---------------- GET UPDATE ---------------- */
app.get("/updatenotify", (req, res) => {
  res.json({
    success: true,
    updateData: latestUpdate, // Send the latest update
    dateTime: new Date().toISOString() // Include current date and time
  });
});


/* ---------------- START ---------------- */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Statcheck server running on port ${PORT}`);
});
