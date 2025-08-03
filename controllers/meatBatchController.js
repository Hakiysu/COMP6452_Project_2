const meatBatchService = require('../services/meatBatchService');
const meatBatchContractService = require('../services/contract/meatBatchContractService');


//createBatch
exports.createBatch = async (req, res) => {
  // gather data
  // receive: wallet_addr, animal_type, batch_id
  const { walletAddr, animalType, batchId } = req.body;
  // create timestamp and status
  // like 2025-08-03 06:41:21
  const create_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const status = "Created";
  // create batch in database
  const batch = await meatBatchService.createBatch(walletAddr, animalType, batchId, create_timestamp, status);
  // also create batch on blockchain
  const txHash = await meatBatchContractService.createBatch(batchId, animalType, walletAddr);
  res.json({ success: true, batch, txHash });
};

//getAllBatches
exports.getAllBatches = async (req, res) => {
  const batches = await meatBatchService.getAllBatches();
  if (!batches || batches.length === 0) {
    return res.status(404).json({ error: "No batches found" });
  }
  res.json({ success: true, batches });
};

//getBatchById
exports.getBatchById = async (req, res) => {
  const { batchId } = req.query;
  if (!batchId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const batch = await meatBatchService.getBatchById(batchId);
  if (!batch) {
    return res.status(404).json({ error: "Batch not found" });
  }
  res.json({ success: true, batch });
};

//getBatchByBatchId
exports.getBatchByBatchId = async (batchId) => {
  if (!batchId) {
    throw new Error("Missing required fields");
  }
  const batch = await meatBatchService.getBatchByBatchId(batchId);
  if (!batch) {
    throw new Error("Batch not found");
  }
  return batch;
};

// if batch exists, get true or false
exports.ifBatchExists = async (batchId) => {
  if (!batchId) {
    throw new Error("Missing required fields");
  }
  const batch = await meatBatchService.getBatchByBatchId(batchId);
  return !!batch;
};

// if batch exists
exports.batchExists = async (batchId) => {
  if (!batchId) {
    throw new Error("Missing required fields");
  }
  const batch = await meatBatchService.getBatchByBatchId(batchId);
  return !!batch;
};


// feedBatch
exports.feedBatch = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  console.log("Feeding batch with data:", req.body);
  if (!walletAddr || !recordData || !batchId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stage = "Feeding Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_offchain = await meatBatchService.feedBatch(batchId, stage, jsonData, walletAddr, timestamp);
  const tx_onchain = await meatBatchContractService.feedBatch(batchId, stage, jsonData);
  res.json({ success: true, tx_offchain, tx_onchain });
};

// slaughterBatch
exports.slaughterBatch = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  console.log("Slaughtering batch with data:", req.body);
  if (!batchId || !recordData || !walletAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const stage = "Slaughter Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_offchain = await meatBatchService.slaughterBatch(batchId, stage, jsonData, walletAddr, timestamp);
  const tx_onchain = await meatBatchContractService.slaughterBatch(batchId, stage, jsonData);
  res.json({ success: true, tx_offchain, tx_onchain });
};

// inspectBatch
exports.inspectBatch = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  console.log("Inspecting batch with data:", req.body);
  console.log("Received data:", batchId, recordData, walletAddr);
  if (!batchId || !recordData || !walletAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stage = "Inspection Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_offchain = await meatBatchService.inspectBatch(batchId, stage, jsonData, walletAddr, timestamp);
  const tx_onchain = await meatBatchContractService.inspectBatch(batchId, stage, jsonData);
  res.json({ success: true, tx_offchain, tx_onchain });
};

// approveBatch
exports.approveBatch = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  if (!batchId || !recordData || !walletAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stage = "Approval Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_offchain = await meatBatchService.approveBatch(batchId, stage, jsonData, walletAddr, timestamp);
  const tx_onchain = await meatBatchContractService.approveBatch(batchId, stage, jsonData);
  res.json({ success: true, tx_offchain, tx_onchain });
};
        

// getBatchRecordsByBatchId
exports.getBatchRecordsByBatchId = async (req, res) => {
  const { batchId } = req.body;
  if (!batchId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const records = await meatBatchService.getBatchRecordsByBatchId(batchId);
  records.forEach(record => {
    if (record.content) {
      try {
        record.content = JSON.parse(record.content);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  });
  console.log("Retrieved records:", records);
  return res.json({ success: true, records });
};


// check batch on blockchain
exports.getBatchByIdOnchain = async (req, res) => {
  const { batchId } = req.body;
  console.log("Getting batch by ID onchain:", batchId);
  console.log("Received data:", req.body);
  if (!batchId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const batch = await meatBatchContractService.getBatchById(batchId);
  // JSON stringify the batch data
  console.log("Batch data retrieved:", batch);
  // Check if batch exists
  if (!batch) {
    return res.status(404).json({ error: "Batch not found" });
  }
  jsonData = JSON.stringify(batch, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );

  return res.json({ success: true, batch: jsonData });
};