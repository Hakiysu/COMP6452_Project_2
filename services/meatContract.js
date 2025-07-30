// services/meatContract.js
// use to interact with the MeatBatch contract

const { ethers } = require("ethers");
const config = require("../config");
const meatBatch = require("../artifacts/contracts/MeatBatch.sol/MeatBatch.json");
// Load contract ABI and address from artifacts

const meatBatchABI = meatBatch.abi;

const provider = new ethers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.CONTRACT_ADDRESS, meatBatchABI, signer);



module.exports = contract;