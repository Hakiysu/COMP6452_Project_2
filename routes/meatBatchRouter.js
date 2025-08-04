const express = require("express");
const router = express.Router();

// meatbatch routes
const meatBatchController = require("../controllers/meatBatchController");
const userService = require("../services/userService");

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
    console.log("Received data:", walletAddr, animalType, batchId);
    if (!walletAddr || !animalType || !batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // check if user exists
    const isRegistered = await userService.isUserRegistered(walletAddr);
    if (!isRegistered) {
      return res.status(400).json({ error: "User is not registered" });
    }
    // check if user is authorized to create batch
    if (!await userService.validateUserRole(walletAddr, 'FARMER_ROLE')) {
      return res.status(400).json({ error: "Unauthorized user role" });
    }
    console.log("User is authorized to create batch");
    // proceed to create batch
    console.log("Proceeding to create batch with ID:", batchId);
    // check if batch already exists
    const existingBatch = await meatBatchController.ifBatchExists(batchId);
    if (existingBatch) {
      return res.status(400).json({ error: "Batch already exists" });
    }
    await meatBatchController.createBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//getBatchByBatchId
router.get('/getBatchByBatchId', async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await meatBatchController.getBatchByBatchId(batchId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all batches
router.get('/getAll', async (req, res) => {
  try {
    await meatBatchController.getAllBatches(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//progress batch
router.post('/progress', async (req, res) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await meatBatchController.progressBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// feedBatch
router.post('/feedBatch', async (req, res) => {
  try {
    const { batchId, recordData, walletAddr } = req.body;
    console.log("Feeding batch with data:", req.body);
    if (!batchId || !recordData || !walletAddr) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // check if batch exists
    const batchExists = await meatBatchController.ifBatchExists(batchId);
    if (!batchExists) {
      return res.status(404).json({ error: "Batch not found" });
    }
    // check if user is authorized to feed batch
    if (!await userService.validateUserRole(walletAddr, 'FARMER_ROLE')) {
      return res.status(400).json({ error: "Unauthorized user role" });
    }
    console.log("User is authorized to feed batch");
    // proceed to feed batch
    console.log("Proceeding to feed batch:", batchId);
    await meatBatchController.feedBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// slaughterBatch
router.post('/slaughterBatch', async (req, res) => {
  try {
    const { batchId, recordData, walletAddr } = req.body;
    if (!batchId || !recordData || !walletAddr) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // check if batch exists
    const batchExists = await meatBatchController.ifBatchExists(batchId);
    if (!batchExists) {
      return res.status(404).json({ error: "Batch not found" });
    }
    // check if user is authorized to slaughter batch
    if (!await userService.validateUserRole(walletAddr, 'SLAUGHTER_ROLE')) {
      return res.status(400).json({ error: "Unauthorized user role" });
    }
    console.log("User is authorized to slaughter batch");
    // proceed to slaughter batch
    console.log("Proceeding to slaughter batch:", batchId);
    await meatBatchController.slaughterBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// inspectBatch
router.post('/inspectBatch', async (req, res) => {
  try {
    const { batchId, recordData, walletAddr } = req.body;
    if (!batchId || !recordData || !walletAddr) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // check if batch exists
    const batchExists = await meatBatchController.ifBatchExists(batchId);
    if (!batchExists) {
      return res.status(404).json({ error: "Batch not found" });
    }
    // check if user is authorized to inspect batch
    if (!await userService.validateUserRole(walletAddr, 'INSPECTOR_ROLE')) {
      return res.status(400).json({ error: "Unauthorized user role" });
    }
    console.log("User is authorized to inspect batch");
    // proceed to inspect batch
    console.log("Proceeding to inspect batch:", batchId);
    await meatBatchController.inspectBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// approveBatch
router.post('/approveBatch', async (req, res) => {
  try {
    const { batchId, recordData, walletAddr } = req.body;
    if (!batchId || !recordData || !walletAddr) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // check if batch exists
    const batchExists = await meatBatchController.ifBatchExists(batchId);
    if (!batchExists) {
      return res.status(404).json({ error: "Batch not found" });
    }
    // check if user is authorized to approve batch
    if (!await userService.validateUserRole(walletAddr, 'REGULATOR_ROLE')) {
      return res.status(400).json({ error: "Unauthorized user role" });
    }
    console.log("User is authorized to approve batch");
    // proceed to approve batch
    console.log("Proceeding to approve batch:", batchId);
    await meatBatchController.approveBatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//get record by batch id
router.post('/getRecordByBatchId', async (req, res) => {
  try {
    const { batchId } = req.body;
    console.log("Getting records for batch:", batchId);
    if (!batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await meatBatchController.getBatchRecordsByBatchId(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//getBatchByIdOnchain
router.post('/getBatchByIdOnchain', async (req, res) => {
  try {
    const { batchId } = req.body;
    console.log("Getting batch by ID on-chain:", batchId);
    if (!batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await meatBatchController.getBatchByIdOnchain(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//get batch records by batch id onchain
router.post('/getBatchRecordsByBatchIdOnchain', async (req, res) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await meatBatchController.getBatchRecordsByBatchIdOnchain(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
