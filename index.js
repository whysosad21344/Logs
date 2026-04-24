const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

/* ---------------- STATCHECK ---------------- */
// POST endpoint to receive any data from Discord or other sources
app.post("/statcheck", (req, res) => {
    const { username } = req.body; // Extract the username from the request body
    console.log('Received username:', username); // Log the received username
    res.json({ success: true, message: "Data received successfully" });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
