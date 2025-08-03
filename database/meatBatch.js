// db/meatBatch.js
const db = require('./index');

// 初始化表（可在 app 启动时调用一次）
async function initMeatBatchTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS meat_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT UNIQUE,
      farmer_wallet TEXT,
      creation_time TEXT,
      current_stage TEXT,
      status TEXT,
      chain_tx TEXT
    )
  `;
  await db.run(sql);
}

// 创建新批次（数据库中）
async function createMeatBatch(batchId, farmerWallet) {
  const sql = `
    INSERT INTO meat_batches (batch_id, farmer_wallet, creation_time, current_stage, status)
    VALUES (?, ?, datetime('now'), 'FARM_CREATED', 'PENDING')
  `;
  return await db.run(sql, [batchId, farmerWallet]);
}

// 添加上链交易哈希
async function setChainTx(batchId, txHash) {
  const sql = `UPDATE meat_batches SET chain_tx = ? WHERE batch_id = ?`;
  return await db.run(sql, [txHash, batchId]);
}

// 查询所有批次
async function getAllBatches() {
  const sql = `SELECT * FROM meat_batches ORDER BY creation_time DESC`;
  return await db.all(sql);
}

// 根据 batch_id 查询单个批次
async function getBatchById(batchId) {
  const sql = `SELECT * FROM meat_batches WHERE batch_id = ?`;
  return await db.get(sql, [batchId]);
}

// 更新批次状态
async function updateBatchStage(batchId, newStage) {
  const sql = `UPDATE meat_batches SET current_stage = ? WHERE batch_id = ?`;
  return await db.run(sql, [newStage, batchId]);
}

// 获取所有未完成批次（例如：状态不是 COMPLETED）
async function getActiveBatches() {
  const sql = `SELECT * FROM meat_batches WHERE status != 'COMPLETED'`;
  return await db.all(sql);
}

module.exports = {
  initMeatBatchTable,
  createMeatBatch,
  setChainTx,
  getAllBatches,
  getBatchById,
  updateBatchStage,
  getActiveBatches,
};
