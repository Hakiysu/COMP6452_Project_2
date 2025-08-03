const db = require('../database');

async function getBatchById(batchId) {
  const sql = `SELECT * FROM meat_batches WHERE batch_id = ?`;
  return await db.get(sql, [batchId]);
}

async function getAllBatches() {
  const sql = `SELECT * FROM meat_batches`;
  return await db.all(sql);
}

async function createBatch(walletAddr, animalType, batchId, createTimestamp, status) {
  const sql = `INSERT INTO meat_batches (wallet_addr, animal_type, batch_id, create_timestamp, status) VALUES (?, ?, ?, ?, ?)`;
  return await db.run(sql, [walletAddr, animalType, batchId, createTimestamp, status]);
}

async function addRecord(batchId, recordData) {
  const sql = `INSERT INTO meat_batch_records (batch_id, record_data) VALUES (?, ?)`;
  return await db.run(sql, [batchId, recordData]);
}

// check if batch is approved by regulator
async function isBatchApproved(batchId) {
  const sql = `SELECT status FROM meat_batches WHERE batch_id = ?`;
  const batch = await db.get(sql, [batchId]);
  return batch && batch.status === 'APPROVED';
}

async function progressBatch(batchId) {
  // only verify by regulator, then can progress batch
  if (!await isBatchApproved(batchId)) {
    throw new Error("Batch is not approved");
  }
  const sql = `UPDATE meat_batches SET status = 'In Progress' WHERE batch_id = ?`;
  return await db.run(sql, [batchId]);
}

module.exports = {
  getBatchById,
  getAllBatches,
  createBatch,
  addRecord,
  progressBatch
};
const meatBatchController = require('../controllers/meatBatchController');

// createBatch