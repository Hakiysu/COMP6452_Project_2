const express = require("express");
const router = express.Router();
//const contract = require("../services/regulator");

// index
router.get('/', (req, res) => {
  res.send(`
        <h1>Welcome to the Meat Regulator API</h1>
        <p>Use this API to manage meat batches and their statuses.</p>
        <ul>
            <li><a href="/api">Back to Home</a></li>
        </ul>
    `);
});






module.exports = router;
