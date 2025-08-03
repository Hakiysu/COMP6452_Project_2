// services/meatContract.js
// use to interact with the MeatBatch contract

const { ethers } = require("ethers");
const config = require("../../config");
const meatBatch = require("../../artifacts/contracts/MeatBatch.sol/MeatBatch.json");
// Load contract ABI and address from artifacts

const meatBatchABI = meatBatch.abi;

const provider = new ethers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.CONTRACT_ADDRESS, meatBatchABI, signer);



// createBatch
async function createBatch(walletAddr, animalType, batchId, createTimestamp, status) {
    // Call the contract's createBatch function
    const tx = await contract.createBatch(walletAddr, animalType, batchId, createTimestamp, status);
    await tx.wait(); // Wait for the transaction to be mined
    return tx.hash; // Return the transaction hash
}

async function getBatch(batchId) {
    const batch = await contract.getBatch(batchId);
    return batch;
}

module.exports = {
    createBatch,
    getBatch
};