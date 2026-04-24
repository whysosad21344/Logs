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

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
