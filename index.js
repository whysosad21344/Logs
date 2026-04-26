const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames, stats, and guilds
let usersData = {};
let guildData = {}; // New in-memory storage for guild data
let latestUpdate = ""; // Variable to store the latest update

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
  const { username, message, stats } = req.body; // Extract username, message, and stats
  if (username && message && stats) {
    console.log(`Confirmation received: ${username} - ${message}`); // Store stats for the user
    if (!usersData[username]) {
      usersData[username] = {}; // Initialize if not already present
    }
    usersData[username].stats = stats; // Store the stats
    console.log("Stats received for user:", username);
    console.log(stats);
    res.json({
      success: true,
      message: "Confirmation and stats received successfully",
      dateTime: new Date().toISOString() // Include current date and time
    });
  } else {
    res.json({
      success: false,
      message: "Invalid username, message, or stats",
      dateTime: new Date().toISOString() // Include current date and time
    });
  }
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

// Ensure axios is required at the top of your file
const axios = require('axios');

// ---------------- GUILDSTATCHECK (POST) ----------------
app.post("/guildstatcheck", (req, res) => {
  const { userID } = req.body; // Extract the userID from the request body
  if (userID) { // Store the userID temporarily (in the scope of this request)
    latestUserID = userID;
    console.log(`Received Userid: ${userID}`); // Log the received userID
    // Respond back to the bot
    res.send(`Received Userid: ${userID}`);
  } else {
    res.status(400).send('UserID is missing.'); // If no userID is provided, notify the bot
  }
});

/* ---------------- GUILDSTATCHECK (GET) ---------------- */
app.get("/guildstatcheck", (req, res) => {
  // Return the latest userID received from the POST request (if any)
  if (latestUserID) {
    res.send(`Latest Userid: ${latestUserID}`); // Send back the latest userID
  } else {
    res.send('No userID received yet. Please send a POST request first.'); // Notify if no userID is received
  }
});

/* ---------------- CLEAR GUILD STATCHECK ---------------- */
app.post("/clearguildstatcheck", (req, res) => {
  if (latestUserID) {
    latestUserID = null; // Clear the stored userID
    console.log('GuildStatCheck data cleared.');
    res.json({
      success: true,
      message: 'GuildStatCheck data cleared.'
    });
  } else {
    res.json({
      success: false,
      message: 'No GuildStatCheck data to clear.'
    });
  }
});

/* ---------------- GUILDDATACONFIRMED (POST) ---------------- */
app.post("/guilddataconfirmed", (req, res) => {
  const { userID, confirmationData } = req.body; // Extract the userID and confirmationData from the request body

  if (userID && confirmationData) {
    confirmedData = { userID, confirmationData }; // Store the confirmed data, including userID
    console.log(`GuildDataConfirmed received: UserID = ${userID}, ConfirmationData = ${JSON.stringify(confirmationData)}`);
    res.send(`GuildDataConfirmed: UserID = ${userID}, Data = ${JSON.stringify(confirmationData)}`); // Send response back with userID and confirmation data
  } else {
    res.send('UserID or confirmationData is missing.'); // If either userID or confirmationData is missing
  }
});

/* ---------------- GUILDDATACONFIRMED (GET) ---------------- */
app.get("/guilddataconfirmed", (req, res) => {
  if (confirmedData) {
    // Return the latest confirmed data (including userID and confirmationData)
    res.json({ userID: confirmedData.userID, confirmationData: confirmedData.confirmationData });
  } else {
    res.json({ message: 'No GuildDataConfirmed yet. Please send a POST request first.' });
  }
});

/* ---------------- CLEAR GUILD DATACONFIRMED ---------------- */
app.post("/clearguilddataconfirmed", (req, res) => {
  if (confirmedData) {
    confirmedData = null; // Clear the stored confirmed data
    console.log('GuildDataConfirmed data cleared.');
    res.json({
      success: true,
      message: 'GuildDataConfirmed data cleared.'
    });
  } else {
    res.json({
      success: false,
      message: 'No GuildDataConfirmed data to clear.'
    });
  }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Statcheck server running on port ${PORT}`);
});
