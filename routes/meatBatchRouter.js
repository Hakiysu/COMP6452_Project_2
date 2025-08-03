const express = require("express");
const router = express.Router();

// meatbatch routes
const meatBatchController = require("../controllers/meatBatchController");
// router.post('/createBatch', meatBatchController.createBatch);
// router.post('/addRecord', meatBatchController.addRecord);
// router.get('/getStatus', meatBatchController.getStatus);
// router.get('/getAll', meatBatchController.getAllBatches);
// router.post('/progress', meatBatchController.progressBatch);

// index
router.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Meat Batch API</h1>
        <p>Use this API to manage meat batches and their statuses.</p>
        <ul>
            <li><a href="/api">Back to Home</a></li>
            <li><a href="/batch/create">Create Batch</a></li>
            <li><a href="/batch/addRecord">Add Record</a></li>
            <li><a href="/batch/getStatus">Get Status</a></li>
            <li><a href="/batch/getAll">Get All Batches</a></li>
            <li><a href="/batch/progress">Progress Batch</a></li>
        </ul>
    `);
});



//createBatch
router.post('/createBatch', async (req, res) => {
  try {
    console.log("Creating batch with data:", req.body);
    const { walletAddr, animalType, batchId } = req.body;
    if (!validateUserRole(walletAddr, 'Farmer')) {
      return res.status(400).json({ error: "Unauthorized user role" });
    }
    if (!walletAddr || !animalType || !batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    meatBatchController.createBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
