const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Your StatTest service logic
app.get('/statTest', (req, res) => {
    // Example of a basic statistical test: Mean of numbers (just as a simple example)
    const numbers = req.query.numbers ? req.query.numbers.split(',').map(Number) : [];

    if (numbers.length === 0) {
        return res.status(400).json({ error: 'No numbers provided for the test' });
    }

    const mean = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
    
    res.json({
        mean: mean,
        data: numbers
    });
});

// Start the server
app.listen(port, () => {
    console.log(`StatTest web service is running on http://localhost:${port}`);
});
