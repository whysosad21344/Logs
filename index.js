const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON payloads

// In-memory storage for usernames (just for demo purposes)
let usernames = [];

/* ---------------- STATCHECK ---------------- */
// POST endpoint to receive usernames and stats
app.post("/statcheck", (req, res) => {
    const { username, damage_percentage, sword_damage_percentage, melee_damage_percentage, crit_chance_percentage, crit_damage_percentage, lifesteal_percentage, damage_reduction_percentage, hp_regen_percentage, luck_percentage, exp_percentage, money_percentage, gems_percentage } = req.body; // Extract the username and stats from the request body

    if (username && !usernames.includes(username)) {
        usernames.push(username); // Store the username if not already stored
        console.log('Received stats for username:', username);
        console.log('Damage Percentage:', damage_percentage);
        console.log('Sword Damage Percentage:', sword_damage_percentage);
        console.log('Melee Damage Percentage:', melee_damage_percentage);
        console.log('Crit Chance Percentage:', crit_chance_percentage);
        console.log('Crit Damage Percentage:', crit_damage_percentage);
        console.log('Lifesteal Percentage:', lifesteal_percentage);
        console.log('Damage Reduction Percentage:', damage_reduction_percentage);
        console.log('HP Regen Percentage:', hp_regen_percentage);
        console.log('Luck Percentage:', luck_percentage);
        console.log('EXP Percentage:', exp_percentage);
        console.log('Money Percentage:', money_percentage);
        console.log('Gems Percentage:', gems_percentage);

        // Respond back to the client
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
