const db = require('../database');

async function getBatchByBatchId(batchId) {
  const sql = `SELECT * FROM meat_batches WHERE batch_id = ?`;
  return await db.get(sql, [batchId]);
}

async function getAllBatches() {
  const sql = `SELECT * FROM meat_batches`;
  return await db.all(sql);
}

async function createBatch(creator_wallet_address, animalType, batchId, createdAt, status) {
  const sql = `INSERT INTO meat_batches (creator_wallet_address, animal_type, batch_id, created_at, status) VALUES (?, ?, ?, ?, ?)`;
  return await db.run(sql, [creator_wallet_address, animalType, batchId, createdAt, status]);
}

async function feedBatch(batchId, stage, recordData, createdBy, createdAt) {
  const sql1 = `INSERT INTO meat_batch_records (batch_id, stage, content, created_by, created_at) VALUES (?, ?, ?, ?, ?)`;
  const sql2 = `UPDATE meat_batches SET status = 'Feeding' WHERE batch_id = ?`;
  const sql3 = `UPDATE meat_batches SET updated_at = ? WHERE batch_id = ?`;
  await db.run(sql1, [batchId, stage, recordData, createdBy, createdAt]);
  await db.run(sql2, [batchId]);
  return await db.run(sql3, [createdAt, batchId]);
}

async function slaughterBatch(batchId, stage, recordData, createdBy, createdAt) {
  const sql1 = `INSERT INTO meat_batch_records (batch_id, stage, content, created_by, created_at) VALUES (?, ?, ?, ?, ?)`;
  await db.run(sql1, [batchId, stage, recordData, createdBy, createdAt]);
  const sql2 = `UPDATE meat_batches SET status = 'Slaughtered' WHERE batch_id = ?`;
  await db.run(sql2, [batchId]);
  const sql3 = `UPDATE meat_batches SET updated_at = ? WHERE batch_id = ?`;
  return await db.run(sql3, [createdAt, batchId]);
}

async function inspectBatchPass(batchId, stage, recordData, createdBy, createdAt) {
  const sql1 = `INSERT INTO meat_batch_records (batch_id, stage, content, created_by, created_at) VALUES (?, ?, ?, ?, ?)`;
  await db.run(sql1, [batchId, stage, recordData, createdBy, createdAt]);
  const sql2 = `UPDATE meat_batches SET status = 'Inspected' WHERE batch_id = ?`;
  await db.run(sql2, [batchId]);
  const sql3 = `UPDATE meat_batches SET updated_at = ? WHERE batch_id = ?`;
  return await db.run(sql3, [createdAt, batchId]);
}
async function inspectBatchFail(batchId, stage, recordData, createdBy, createdAt) {
  const sql1 = `INSERT INTO meat_batch_records (batch_id, stage, content, created_by, created_at) VALUES (?, ?, ?, ?, ?)`;
  await db.run(sql1, [batchId, stage, recordData, createdBy, createdAt]);
  const sql2 = `UPDATE meat_batches SET status = 'Recheck' WHERE batch_id = ?`;
  await db.run(sql2, [batchId]);
  const sql3 = `UPDATE meat_batches SET updated_at = ? WHERE batch_id = ?`;
  return await db.run(sql3, [createdAt, batchId]);
}

async function approveBatch(batchId, stage, recordData, createdBy, createdAt) {
  const sql1 = `INSERT INTO meat_batch_records (batch_id, stage, content, created_by, created_at) VALUES (?, ?, ?, ?, ?)`;
  await db.run(sql1, [batchId, stage, recordData, createdBy, createdAt]);
  const sql2 = `UPDATE meat_batches SET status = 'Approved' WHERE batch_id = ?`;
  await db.run(sql2, [batchId]);
  const sql3 = `UPDATE meat_batches SET updated_at = ? WHERE batch_id = ?`;
  return await db.run(sql3, [createdAt, batchId]);
}

async function rejectBatch(batchId, stage, recordData, createdBy, createdAt) {
  const sql = `INSERT INTO meat_batch_records (batch_id, stage, content, created_by, created_at) VALUES (?, ?, ?, ?, ?)`;
  await db.run(sql, [batchId, stage, recordData, createdBy, createdAt]);
  const sql2 = `UPDATE meat_batches SET status = 'Rejected' WHERE batch_id = ?`;
  await db.run(sql2, [batchId]);
  const sql3 = `UPDATE meat_batches SET updated_at = ? WHERE batch_id = ?`;
  return await db.run(sql3, [createdAt, batchId]);
}
///getBatchRecordByBatchId
async function getBatchRecordsByBatchId(batchId) {
  const sql = `SELECT * FROM meat_batch_records WHERE batch_id = ?`;
  return await db.all(sql, [batchId]);
}

// check if batch is approved by regulator
async function isBatchApproved(batchId) {
  const sql = `SELECT status FROM meat_batches WHERE batch_id = ?`;
  const batch = await db.get(sql, [batchId]);
  return batch && batch.status === 'APPROVED';
}

async function progressBatch(batchId) {
  // only verify by regulator, then can progress batch
  // if (!await isBatchApproved(batchId)) {
  //   throw new Error("Batch is not approved");
  // }
  const sql = `UPDATE meat_batches SET status = 'In Progress' WHERE batch_id = ?`;
  return await db.run(sql, [batchId]);

}









module.exports = {
  getBatchByBatchId,
  getAllBatches,
  createBatch,
  approveBatch,
  feedBatch,
  slaughterBatch,
  approveBatch,
  progressBatch,
  isBatchApproved,
  getBatchRecordsByBatchId,
  inspectBatchPass,
  inspectBatchFail,
  rejectBatch
};

// createBatch