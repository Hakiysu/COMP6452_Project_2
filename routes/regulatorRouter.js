const express = require("express");
const router = express.Router();
//const contract = require("../services/regulator");

// index
router.get('/', (req, res) => {w
  res.send(`
        <h1>Welcome to the Meat Regulator API</h1>
        <p>Use this API to manage meat batches and their statuses.</p>
        <ul>
            <li><a href="/api">Back to Home</a></li>
        </ul>
    `);
});

// approveBatch
router.post('/approveBatch', async (req, res) => {
  try {
    const { batchId, approved, remarks } = req.body;
    const txHash = await contract.inspectBatch(batchId, approved, remarks);
    res.json({ txHash });
  } catch (error) {
    console.error("Error approving batch:", error);
    res.status(500).json({ error: "Failed to approve batch" });
  }
});

module.exports = router;
