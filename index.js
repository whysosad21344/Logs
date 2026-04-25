const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames and their associated stats
let usersData = {};

// Variable to store the latest update (this will be dynamically updated)
let latestUpdate = ""; // Start with an empty string

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
    const { username } = req.body; // Extract the username from the request body
    if (username && !usersData[username]) {
        usersData[username] = {}; // Initialize an empty stats object for this username
        console.log('Received username:', username); // Log the received username
        res.json({ success: true, message: "Data received successfully", dateTime: new Date().toISOString() });
    } else {
        res.json({ success: false, message: "Username already received or invalid", dateTime: new Date().toISOString() });
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
            dateTime: new Date().toISOString()  // Include current date and time
        });
    } else {
        res.json({
            success: false,
            message: `Username ${username} not found`,
            dateTime: new Date().toISOString()  // Include current date and time
        });
    }
});

/* ---------------- CONFIRM USER ---------------- */
app.post("/confirmfound", (req, res) => {
    const { username, message, stats } = req.body; // Extract username, message, and stats
    if (username && message && stats) {
        console.log(`Confirmation received: ${username} - ${message}`);

        // Store stats for the user
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
        res.json({ success: true, message: `Data for ${username} cleared.` });
    } else {
        res.json({ success: false, message: `Username ${username} not found or already cleared.` });
    }
});

/* ---------------- UPDATE NOTIFY ---------------- */
// POST endpoint to receive updates (can be used later for reading)
app.post("/updatenotify", (req, res) => {
    const { updateData } = req.body; // Extract the update data from the request body
    if (updateData) {
        // Log the received update and store it
        console.log('Received update:', updateData);
        latestUpdate = updateData; // Store the latest update (e.g., version)

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
// New endpoint to clear update data after a certain time
app.post("/clearupdatenotify", (req, res) => {
    // Reset the latest update variable after a 10-second delay
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
// GET endpoint to retrieve the current update (e.g., version)
app.get("/updatenotify", (req, res) => {
    res.json({
        success: true,
        updateData: latestUpdate,  // Send the latest update (e.g., version)
        dateTime: new Date().toISOString()  // Include current date and time
    });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
