const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

/* ---------------- STATCHECK ---------------- */
// POST endpoint to receive any data from Discord or other sources
app.post("/statcheck", (req, res) => {
    // Just return a success message without inspecting the data
    res.json({ success: true, message: "Data received successfully" });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
