const { Wallet } = require("ethers");
const accounts = require("../../configs/accounts.json"); // 假设你的账户信息存储在这个文件中
const { local_provider } = require("../../configs/index.js");
const provider = local_provider

function getSignerByAddress(address) {
  const pk = accounts[address]
  console.log(`getSignerByAddress: address=${address}, pk=${pk}`);
  if (!pk) {
    throw new Error("Unknown wallet address, cannot find private key.");
  }
  return new Wallet(pk, provider); // provider 是 ethers.provider
}

module.exports = { getSignerByAddress };
