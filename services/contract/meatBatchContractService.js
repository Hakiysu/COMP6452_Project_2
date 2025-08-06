// services/meatContract.js
const { ethers } = require("ethers");
const config = require("../../config.js");

const meatBatch = require("../../artifacts/contracts/MeatBatchContract.sol/MeatBatchContract.json");


const meatBatchABI = meatBatch.abi;
const { getSignerByAddress } = require("./utils.js");


module.exports = {
  // create a new batch
  createBatch: async (batchId, animalType, walletAddr) => {
    if (!batchId || !animalType || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    console.log("Creating batch with ID:", batchId, "and animal type:", animalType);
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    console.log("Creating batch with ID:", batchId, "and animal type:", animalType);
    // check if the contract has the createBatch method
    if (!contract.createBatch) {
      throw new Error("createBatch method not found in contract");
    }
    console.log("Contract method createBatch found, proceeding with transaction");
    console.log("Calling createBatch with parameters:", batchId, animalType);
    
    // generate the transaction
    const tx = await contract.createBatch(batchId, animalType);
    await tx.wait();
    return tx.hash;
  },

  // feed
  feedBatch: async (batchId, jsonData, walletAddr) => {
    if (!batchId || !jsonData || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.feedBatch) {
      throw new Error("feedBatch method not found in contract");
    }
    console.log("Feeding batch with ID:", batchId, "and data:", jsonData);
    // generate the transaction
    const tx = await contract.feedBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // slaughter batch
  slaughterBatch: async (batchId,jsonData, walletAddr) => {
    if (!batchId || !jsonData || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.slaughterBatch) {
      throw new Error("slaughterBatch method not found in contract");
    }
    console.log("Slaughtering batch with ID:", batchId, "and data:", jsonData);
    // generate the transaction
    const tx = await contract.slaughterBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // inspector: pass batch
  inspectBatchPass: async (batchId, jsonData, walletAddr) => {
    if (!batchId || !jsonData || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.inspectBatchPass) {
      throw new Error("inspectBatchPass method not found in contract");
    }
    console.log("Inspecting batch with ID:", batchId, "and data:", jsonData );
    const tx = await contract.inspectBatchPass(batchId , jsonData);
    await tx.wait();
    return tx.hash;
  },
  // inspector: fail batch
  inspectBatchFail: async (batchId, jsonData, walletAddr) => {
    if (!batchId || !jsonData || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.inspectBatchFail) {
      throw new Error("inspectBatchFail method not found in contract");
    }
    console.log("Inspecting batch with ID:", batchId, "and data:", jsonData );
    const tx = await contract.inspectBatchFail(batchId , jsonData);
    await tx.wait();
    return tx.hash;
  },

  // regulator: approve batch
  approveBatch: async (batchId, jsonData, walletAddr) => {
    if (!batchId || !jsonData || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.approveBatch) {
      throw new Error("approveBatch method not found in contract");
    }
    console.log("Approving batch with ID:", batchId, "and data:", jsonData );
    const tx = await contract.approveBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // regulator: reject batch
  rejectBatch: async (batchId, jsonData, walletAddr) => {
    if (!batchId || !jsonData || !walletAddr) {
      throw new Error("Missing required fields");
    }
    if (!ethers.isAddress(walletAddr)) {
      throw new Error("Invalid wallet address");
    }
    const signer = getSignerByAddress(walletAddr);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.rejectBatch) {
      throw new Error("rejectBatch method not found in contract");
    }
    console.log("Rejecting batch with ID:", batchId, "and data:", jsonData );
    const tx = await contract.rejectBatch(batchId, jsonData);
    await tx.wait();
    return tx.hash;
  },

  // get batch by batch ID
  getBatchById: async (batchId) => {
    if (!batchId) {
      throw new Error("Missing required fields");
    }
    const signer = getSignerByAddress(config.ADMIN_ACCOUNT);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.getBatchById) {
      throw new Error("getBatchById method not found in contract");
    }
    console.log("Getting batch by ID:", batchId);
    return await contract.getBatchById(batchId);
  },

  // get all batch records
  getAllBatchIds: async () => {
    
    const signer = getSignerByAddress(config.ADMIN_ACCOUNT);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.getAllBatchIds) {
      throw new Error("getAllBatchIds method not found in contract");
    }
    console.log("Getting all batch IDs");
    return await contract.getAllBatchRecords();
  },

  // get batch records by batch ID
  getBatchRecords: async (batchId) => {
    if (!batchId) {
      throw new Error("Missing required fields");
    }
    const signer = getSignerByAddress(config.ADMIN_ACCOUNT);
    const contract = new ethers.Contract(config.MEATBATCH_CONTRACT_ADDRESS, meatBatchABI, signer);
    if (!contract.getBatchRecordsByBatchId) {
      throw new Error("getBatchRecords method not found in contract");
    }
    console.log("Getting batch records for ID:", batchId);
    return await contract.getBatchRecordsByBatchId(batchId);
  }
};