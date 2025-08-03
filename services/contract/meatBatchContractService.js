// services/meatContract.js
const { ethers } = require("ethers");
const config = require("../../config");
const meatBatch = require("../../artifacts/contracts/MeatBatchContract.sol/MeatBatchContract.json");


const meatBatchABI = meatBatch.abi;
const provider = new ethers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.CONTRACT_ADDRESS, meatBatchABI, signer);

module.exports = {
  // 创建批次
  createBatch: async (batchId, animalType) => {
    const tx = await contract.createBatch(batchId, animalType);
    await tx.wait();
    return tx.hash;
  },

  // feed
  feedBatch: async (batchId, jsonData) => {
    const tx = await contract.feedBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // 推进状态
  slaughterBatch: async (batchId,jsonData) => {
    const tx = await contract.slaughterBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // 监管者审批
  inspectBatch: async (batchId, jsonData) => {
    const tx = await contract.inspectBatch(batchId , jsonData);
    await tx.wait();
    return tx.hash;
  },

  approveBatch: async (batchId, jsonData) => {
    const tx = await contract.approveBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // 查询批次信息
  getBatchById: async (batchId) => {
    return await contract.getBatchById(batchId);
  },

  // 查询所有批次ID
  getAllBatchIds: async () => {
    return await contract.getAllBatchIds();
  },

  // 查询某批次所有记录
  getBatchRecords: async (batchId) => {
    return await contract.getBatchRecords(batchId);
  }
};