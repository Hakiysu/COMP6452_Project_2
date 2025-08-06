const meatBatchService = require('../services/meatBatchService');
const meatBatchContractService = require('../services/contract/meatBatchContractService');

const userService = require('../services/userService');

const statusMap = {
  0: 'Created',
  1: 'Fed',
  2: 'Slaughtered',
  3: 'Inspected',
  4: 'Approved',
  5: 'Rejected'
};

function formatBatchData(data) {
  return {
    batchId: data[0],
    owner: data[1],
    animalType: data[2],
    createdAt: new Date(Number(data[3]) * 1000).toISOString().slice(0, 19).replace('T', ' '),
    status: Number(data[4]),  // 如果你有状态映射，可以映射成对应字符串
    exists: data[5],
    updatedAt: new Date(Number(data[6]) * 1000).toISOString().slice(0, 19).replace('T', ' ')
  };
}


//createBatch
exports.createBatch = async (req, res) => {
  // gather data
  // receive: wallet_addr, animal_type, batch_id
  const { walletAddr, animalType, batchId } = req.body;
  if (!walletAddr || !animalType || !batchId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log("Creating batch with data:", req.body);
  // check if batch exists
  const batchExists = await this.ifBatchExists(batchId);
  if (batchExists) {
    return res.status(400).json({ error: "Batch already exists" });
  }
  // check if user is registered
  const isRegistered = await userService.isUserRegistered(walletAddr);
  if (!isRegistered) {
    return res.status(400).json({ error: "User is not registered" });
  }
  // check if user has farmer role
  const hasFarmerRole = await userService.validateUserRole(walletAddr, 'FARMER_ROLE');
  if (!hasFarmerRole) {
    return res.status(403).json({ error: "User does not have farmer role" });
  }
  // create timestamp and status
  // like 2025-08-03 06:41:21
  const create_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const status = "Created";
  
  // also create batch on blockchain
  const txHash = await meatBatchContractService.createBatch(batchId, animalType, walletAddr);
  // create batch in database
  const batch = await meatBatchService.createBatch(walletAddr, animalType, batchId, create_timestamp, status);
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
  const tx_onchain = await meatBatchContractService.feedBatch(batchId, jsonData, walletAddr);
  const tx_offchain = await meatBatchService.feedBatch(batchId, stage, jsonData, walletAddr, timestamp);

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
  const tx_onchain = await meatBatchContractService.slaughterBatch(batchId, jsonData, walletAddr);

  const tx_offchain = await meatBatchService.slaughterBatch(batchId, stage, jsonData, walletAddr, timestamp);
  res.json({ success: true, tx_offchain, tx_onchain });
};

// inspectBatchPass
exports.inspectBatchPass = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  console.log("Inspecting batch with data:", req.body);
  console.log("Received data:", batchId, recordData, walletAddr);
  if (!batchId || !recordData || !walletAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stage = "Inspection Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_onchain = await meatBatchContractService.inspectBatchPass(batchId, jsonData, walletAddr);
  const tx_offchain = await meatBatchService.inspectBatchPass(batchId, stage, jsonData, walletAddr, timestamp);

  res.json({ success: true, tx_offchain, tx_onchain });
};
// inspectBatchFail
exports.inspectBatchFail = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  console.log("Inspecting batch with data:", req.body);
  console.log("Received data:", batchId, recordData, walletAddr);
  if (!batchId || !recordData || !walletAddr) {     
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stage = "Inspection Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_onchain = await meatBatchContractService.inspectBatchFail(batchId, jsonData, walletAddr);
  const tx_offchain = await meatBatchService.inspectBatchFail(batchId, stage, jsonData, walletAddr, timestamp);
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
  const tx_onchain = await meatBatchContractService.approveBatch(batchId, jsonData, walletAddr);

  const tx_offchain = await meatBatchService.approveBatch(batchId, stage, jsonData, walletAddr, timestamp);
  res.json({ success: true, tx_offchain, tx_onchain });
};
        
//rejectBatch
exports.rejectBatch = async (req, res) => {
  const { batchId, recordData, walletAddr } = req.body;
  if (!batchId || !recordData || !walletAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stage = "Rejection Stage";
  const jsonData = JSON.stringify(recordData);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const tx_onchain = await meatBatchContractService.rejectBatch(batchId, jsonData, walletAddr);
  const tx_offchain = await meatBatchService.rejectBatch(batchId, stage, jsonData, walletAddr, timestamp);
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
  // format the batch data
  jsonData = formatBatchData(batch);
  jsonData.status = statusMap[jsonData.status]
  console.log("Formatted batch data:", jsonData);

  return res.json({ success: true, batch: jsonData });
};



// get batch records on blockchain
exports.getBatchRecordsByBatchIdOnchain = async (req, res) => {
  const { batchId } = req.body;
  if (!batchId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log("Getting batch records by ID onchain:", batchId);
  const records = await meatBatchContractService.getBatchRecords(batchId);
  console.log("Retrieved records onchain:", records);
  // Format records
  const recordsFormatted = records.map(r => {
    return {
      stage: r[0],           // string
      content: JSON.parse(r[1]),         // string，直接用，不要JSON.parse
      createdBy: r[2],       // address
      createdAt: r[3].toString(),  // BigInt 转字符串
    };
  });
  console.log("Retrieved records:", recordsFormatted);
  return res.json({ success: true, records: recordsFormatted });
};
