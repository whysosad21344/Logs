const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames and their associated stats
let usersData = {};

/* ---------------- STATCHECK ---------------- */
// POST endpoint to receive usernames (from Discord or other sources)
app.post("/statcheck", (req, res) => {
    const { username } = req.body; // Extract the username from the request body
    if (username && !usersData[username]) {
        usersData[username] = {}; // Initialize an empty stats object for this username
        console.log('Received username:', username); // Log the received username
        res.json({ success: true, message: "Data received successfully" });
    } else {
        res.json({ success: false, message: "Username already received or invalid" });
    }
});

/* ---------------- CHECK USERNAME ---------------- */
// GET endpoint to check if a username is stored and fetch stats
app.get("/checkusername", (req, res) => {
    const { username } = req.query; // Get the username from the query string
    if (usersData[username] && usersData[username].stats) {
        res.json({
            success: true,
            message: `Username ${username} found`,
            stats: usersData[username].stats // Send the stats for the found username
        });
    } else {
        res.json({ success: false, message: `Username ${username} not found` });
    }
});

/* ---------------- CONFIRM USER ---------------- */
// POST endpoint to confirm the username found in the game and store stats
app.post("/confirmfound", (req, res) => {
    const { username, message, stats } = req.body; // Extract username, message, and stats
    if (username && message && stats) {
        // Log the confirmation message (could be "FOUND USER IN GAME" or other)
        console.log(`Confirmation received: ${username} - ${message}`);

        // Store stats for the user
        if (!usersData[username]) {
            usersData[username] = {}; // Initialize if not already present
        }
        usersData[username].stats = stats; // Store the stats

        // Log stats
        console.log("Stats received for user:", username);
        console.log(stats);

        res.json({
            success: true,
            message: "Confirmation and stats received successfully"
        });
    } else {
        res.json({
            success: false,
            message: "Invalid username, message, or stats"
        });
    }
});

/* ---------------- DELETE USER STATS ---------------- */
// DELETE endpoint to remove stats and username after sending the embed
app.delete("/deletestats", (req, res) => {
    const { username } = req.body;
    if (username && usersData[username]) {
        // Remove the stats for the username and delete the username entirely from the server
        delete usersData[username].stats;
        delete usersData[username]; // Remove the entire user from memory
        console.log(`Deleted stats and removed username: ${username}`);
        res.json({
            success: true,
            message: `Stats and username for ${username} have been deleted successfully.`
        });
    } else {
        res.json({
            success: false,
            message: `Username ${username} not found or invalid.`
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
