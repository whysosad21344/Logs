const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames (just for demonstration)
let usernames = [];

/* ---------------- STATCHECK ---------------- */
// POST endpoint to receive usernames (from Discord or other sources)
app.post("/statcheck", (req, res) => {
    const { username } = req.body; // Extract the username from the request body
    if (username && !usernames.includes(username)) {
        usernames.push(username); // Store the username if not already stored
        console.log('Received username:', username); // Log the received username
        res.json({ success: true, message: "Data received successfully" });
    } else {
        res.json({ success: false, message: "Username already received or invalid" });
    }
});

/* ---------------- CHECK USERNAME ---------------- */
// GET endpoint to check if a username is stored
app.get("/checkusername", (req, res) => {
    const { username } = req.query; // Get the username from the query string
    if (usernames.includes(username)) {
        res.json({ success: true, message: `Username ${username} found` });
    } else {
        res.json({ success: false, message: `Username ${username} not found` });
    }
});

/* ---------------- CONFIRM USER ---------------- */
// POST endpoint to confirm the username found in the game
app.post("/confirmfound", (req, res) => {
    const { username, message } = req.body; // Extract username and message
    if (username && message) {
        // Log the confirmation message (could be "FOUND USER IN GAME" or other)
        console.log(`Confirmation received: ${username} - ${message}`);

        // Store the username if it's not already in the list
        if (!usernames.includes(username)) {
            usernames.push(username);
            console.log(`Stored confirmed username: ${username}`);
        }

        res.json({
            success: true,
            message: "Confirmation received successfully"
        });
    } else {
        res.json({
            success: false,
            message: "Invalid username or message"
        });
    }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
