// app.js
const express = require('express');
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Import routes
const router = require('./routes/router');
app.use('/api', router);

// test json request and response
app.post('/test', (req, res) => {
    console.log("Received data:", req.body);
    res.json({ success: true, message: "Data received successfully", data: req.body });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
