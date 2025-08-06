// config/index.js
const { InfuraProvider } = require("ethers");
const { JsonRpcProvider } = require("ethers");

const local_provider = new JsonRpcProvider("http://127.0.0.1:8545");
const remote_provider = new InfuraProvider("sepolia","https://sepolia.infura.io/v3/d6763376844245e1a8eb410ea44713e3");








module.exports = { local_provider, remote_provider };
