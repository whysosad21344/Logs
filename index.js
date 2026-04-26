const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames, stats, and guilds
let usersData = {};
let guildData = {};  // New in-memory storage for guild data
let latestUpdate = ""; // Variable to store the latest update

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
        updateData: latestUpdate,  // Send the latest update
        dateTime: new Date().toISOString()  // Include current date and time
    });
});

/* ---------------- GUILDCHECK ---------------- */
// POST endpoint to receive guild ID
app.post("/guildcheck", (req, res) => {
    const { guildId } = req.body; // Extract the guildId from the request body
    if (guildId) {
        console.log(`Received guild ID: ${guildId}`);  // Log the received guild ID
        res.json({
            success: true,
            message: `Guild ID ${guildId} received successfully`, // Confirm receipt of guildId
            dateTime: new Date().toISOString() // Include current date and time
        });
    } else {
        res.json({
            success: false,
            message: "No guild ID provided", // Handle case where no guildId is provided
            dateTime: new Date().toISOString()  // Include current date and time
        });
    }
});

// GET endpoint to check guild data
app.get("/checkguild", (req, res) => {
    const { guildId } = req.query; // Get the guildId from the query string
    if (guildId) {
        console.log(`Checking for guild ID: ${guildId}`); // Log the guildId being checked
        if (guildData[guildId]) {
            res.json({
                success: true,
                message: `Guild data for guild ID ${guildId} found`,
                guildData: guildData[guildId], // Send the guild data if found
                dateTime: new Date().toISOString()  // Include current date and time
            });
        } else {
            res.json({
                success: false,
                message: `Guild data for guild ID ${guildId} not found`,
                dateTime: new Date().toISOString()  // Include current date and time
            });
        }
    } else {
        res.json({
            success: false,
            message: "No guild ID provided", // Handle case where no guildId is provided
            dateTime: new Date().toISOString()  // Include current date and time
        });
    }
});

// POST endpoint to clear guild data
app.post("/clearguild", (req, res) => {
    const { guildId } = req.body; // Extract the guildId from the request body
    if (guildId && guildData[guildId]) {
        delete guildData[guildId];
        console.log(`Guild data for guild ID ${guildId} cleared.`);
        res.json({ success: true, message: `Guild data for guild ID ${guildId} cleared.` });
    } else {
        res.json({
            success: false,
            message: `Guild ID ${guildId} not found or already cleared.`,
            dateTime: new Date().toISOString()  // Include current date and time
        });
    }
});

/* ---------------- GUILDCHECK ---------------- */
app.get("/checkguild", (req, res) => {
    const { userId } = req.query; // Get the user ID from the query string
    if (!userId) {
        return res.json({
            success: false,
            message: "No user ID provided",
            dateTime: new Date().toISOString()  // Include current date and time
        });
    }

    // Simulate checking for guild membership based on user ID
    // In a real scenario, this would query a database or external API
    const guilds = {
        "12345": { guildName: "Knights of Code", role: "Leader" },
        "67890": { guildName: "Warriors of Code", role: "Member" },
        // Add more users and guilds as needed
    };

    const userGuild = guilds[userId]; // Check if the user is part of any guild

    if (userGuild) {
        res.json({
            success: true,
            message: `User ${userId} is in guild: ${userGuild.guildName}`,
            guild: userGuild,
            dateTime: new Date().toISOString()  // Include current date and time
        });
    } else {
        res.json({
            success: false,
            message: `User ${userId} is not in any guild`,
            dateTime: new Date().toISOString()  // Include current date and time
        });
    }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
