const express = require("express");
const cors = require("cors");  // Import CORS package
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // Enable CORS for all origins
app.use(express.json()); // To parse incoming JSON payloads

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
    console.log('Request body:', req.body);  // Log the entire body to see if it's being sent
    const { username } = req.body;
    console.log('Received username:', username); // Log the received username
    res.json({ success: true, message: "Data received successfully" });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
