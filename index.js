const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const stats = [];  // Array to hold user stats

/* ---------------- STATCHECK ---------------- */
app.post("/statcheck", (req, res) => {
    const {
        username,
        damage_percentage,
        sword_damage_percentage,
        melee_damage_percentage,
        crit_chance_percentage,
        crit_damage_percentage,
        lifesteal_percentage,
        damage_reduction_percentage,
        hp_regen_percentage,
        luck_percentage,
        exp_percentage,
        money_percentage,
        gems_percentage
    } = req.body;

    const log = {
        username: username,
        stats: {
            damage_percentage: parseFloat(damage_percentage),
            sword_damage_percentage: parseFloat(sword_damage_percentage),
            melee_damage_percentage: parseFloat(melee_damage_percentage),
            crit_chance_percentage: parseFloat(crit_chance_percentage),
            crit_damage_percentage: parseFloat(crit_damage_percentage),
            lifesteal_percentage: parseFloat(lifesteal_percentage),
            damage_reduction_percentage: parseFloat(damage_reduction_percentage),
            hp_regen_percentage: parseFloat(hp_regen_percentage),
            luck_percentage: parseFloat(luck_percentage),
            exp_percentage: parseFloat(exp_percentage),
            money_percentage: parseFloat(money_percentage),
            gems_percentage: parseFloat(gems_percentage)
        },
        time: Date.now()
    };

    stats.push(log);
    console.log("📊 STATCHECK LOG:", log);
    res.json({ success: true, message: "User stats logged" });
});

app.get("/statcheck", (req, res) => {
    const username = req.query.username;
    const filteredStats = stats.filter(log => log.username === username);

    if (filteredStats.length === 0) {
        return res.status(404).json({ success: false, message: "No stats found for the given username" });
    }

    res.json({ success: true, data: filteredStats });
});

app.put("/statcheck", (req, res) => {
    const username = req.body.username;
    const updatedStats = req.body.stats;

    let userFound = false;

    for (let stat of stats) {
        if (stat.username === username) {
            stat.stats = { ...stat.stats, ...updatedStats };  // Merge existing stats with updated stats
            stat.time = Date.now();  // Update time to the current timestamp
            userFound = true;
            console.log("📊 UPDATED STATCHECK LOG:", stat);
            break;
        }
    }

    if (!userFound) {
        return res.status(404).json({ success: false, message: "Username not found for update" });
    }

    res.json({ success: true, message: "User stats updated" });
});

app.get("/statcheck/clear", (req, res) => {
    stats.length = 0;
    res.json({ success: true, message: "All user stats cleared" });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
    console.log(`🚀 Statcheck server running on port ${PORT}`);
});
