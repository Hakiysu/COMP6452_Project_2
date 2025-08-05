// config/index.js
const { JsonRpcProvider } = require("ethers");

const local_provider = new JsonRpcProvider("http://127.0.0.1:8545");
const remote_provider = new JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");








module.exports = { local_provider, remote_provider };
