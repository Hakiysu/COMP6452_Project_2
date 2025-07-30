const express = require("express");
const router = express.Router();
const contract = require("../services/meatContract");

// index
router.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Meat Batch API</h1>
        <p>Use this API to manage meat batches and their statuses.</p>
        <ul>
            <li><a href="/api">Back to Home</a></li>
        </ul>
    `);
});

// add
router.post("/add", async (req, res) => {
  const { batchId, originFarmId } = req.body;
  try {
    const tx = await contract.addBatch(batchId, originFarmId);
    await tx.wait();
    res.json({ message: "Batch added", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get status by id
// router.get("/:id", async (req, res) => {
//   try {
//     const status = await contract.getBatchStatus(req.params.id);
//     res.json({ batchId: req.params.id, status: Number(status) });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// progress batch by id
router.post("/:id/next", async (req, res) => {
  try {
    const tx = await contract.progressBatch(req.params.id);
    await tx.wait();
    res.json({ message: "Batch progressed", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// get batchId
router.get('/batchId', async (req, res) => {
  try {
    const batchId = await contract.batchId();
    if (!batchId) {
      return res.status(404).json({ error: "Batch ID not found" });
    }
    res.json({ batchId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
