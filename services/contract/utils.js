const { Wallet } = require("ethers");
const { InfuraProvider } = require("ethers");
const { JsonRpcProvider } = require("ethers");
const accounts = require("../../configs/accounts.json"); // 假设你的账户信息存储在这个文件中
const { local_provider,remote_provider } = require("../../configs/index.js");
const provider= new InfuraProvider("sepolia", "d6763376844245e1a8eb410ea44713e3")



function getSignerByAddress(address) {
  const pk = accounts[address]
  console.log(`getSignerByAddress: address=${address}, pk=${pk}`);
  if (!pk) {
    throw new Error("Unknown wallet address, cannot find private key.");
  }
  console.log('Sending transaction with address:', address," to provider:", provider);
  return new Wallet(pk, provider); // provider 是 ethers.provider
}

module.exports = { getSignerByAddress };
