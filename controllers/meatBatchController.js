const express = require('express');
const meatService = require('../services/batchService');


//createBatch
exports.createBatch = async (req, res) => {
    // gather data
    // receive: wallet_addr, animal_type, batch_id
    const { walletAddr, animalType, batchId } = req.body;
    // create timestamp and status
    const create_timestamp = new Date().toISOString();
    const status = "Created";
    // create batch in database
    const batch = await meatService.createBatch(walletAddr, animalType, batchId, create_timestamp, status);
    res.json({ success: true, batch });
};


//addRecord
exports.addRecord = async (req, res) => {

    // gather data
    // receive: batchId, recordData
  const { batchId, recordData } = req.body;
  const tx = await meatContract.addRecord(batchId, recordData);
  res.json({ success: true, tx });
};


//getStatus
exports.getStatus = async (req, res) => {
  const { batchId } = req.query;
  const status = await meatContract.getStatus(batchId);
  res.json({ success: true, status });
};


//getAllBatches
exports.getAllBatches = async (req, res) => {
  const batches = await meatContract.getAllBatches();
  res.json({ success: true, batches });
};

//progressBatch
exports.progressBatch = async (req, res) => {
  const { batchId } = req.body;
  const tx = await meatContract.progressBatch(batchId);
  res.json({ success: true, tx });
};
