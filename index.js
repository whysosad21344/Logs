const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames (just for demonstration)
let usernames = [];

/* ---------------- STATCHECK ---------------- */
// POST endpoint to receive usernames (from Discord or other sources)
app.post("/statcheck", (req, res) => {
    const { username, message } = req.body; // Extract username and message from the request body

    // Check if username is present
    if (username && message) {
        // Log the received username and message for confirmation
        console.log(`Received confirmation: ${username} - ${message}`);

        // Check if the username is already in the list
        if (!usernames.includes(username)) {
            usernames.push(username); // Add username to the list if not already stored
            res.status(200).json({
                success: true,
                message: "Data received successfully",
            });
        } else {
            // If the username is already stored, return an appropriate response
            res.status(400).json({
                success: false,
                message: "Username already received",
            });
        }
    } else {
        // If username or message is missing, return an error response
        res.status(400).json({
            success: false,
            message: "Invalid username or message",
        });
    }
});

/* ---------------- CHECK USERNAME ---------------- */
// GET endpoint to check if a username is stored
app.get("/checkusername", (req, res) => {
    const { username } = req.query; // Get the username from the query string

    // Handle missing query parameter
    if (!username) {
        return res.status(400).json({
            success: false,
            message: "Username query parameter is required",
        });
    }

    // Check if the username is stored
    if (usernames.includes(username)) {
        return res.status(200).json({
            success: true,
            message: `Username ${username} found`,
        });
    } else {
        return res.status(404).json({
            success: false,
            message: `Username ${username} not found`,
        });
    }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
