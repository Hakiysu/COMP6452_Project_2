// app.js
const express = require('express');
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Import routes
const router = require('./routes/router');
app.use('/api', router);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
