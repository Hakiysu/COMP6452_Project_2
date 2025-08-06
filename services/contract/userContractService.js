// user contract service
const { ethers } = require('ethers');
const config = require("../../config.js");
const user = require("../../artifacts/contracts/UserAccessControl.sol/UserAccessControl.json");
const { getSignerByAddress } = require("./utils.js");
const userABI = user.abi;

const roleMap = ["FARMER_ROLE", "SLAUGHTER_ROLE", "INSPECTOR_ROLE", "REGULATOR_ROLE"];
//admin
const ADMIN = config.ADMIN_ACCOUNT; // Admin account address
const ADMIN_PRIVATE_KEY = config.ADMIN_PRIVATE_KEY


async function grantRoleToUser(userAddress, role) {
  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid Ethereum address");
  }
  if (!roleMap.includes(role)) {
    throw new Error("Invalid role");
  }


  console.log(`Granting role ${role} to user ${userAddress} by admin ${ADMIN}`);
  const singer = getSignerByAddress(ADMIN);
  const contract = new ethers.Contract(config.ACCESS_CONTROL_CONTRACT_ADDRESS, userABI, singer);

  // grant the role to the user
  const tx = await contract.grantRoleTo(role, userAddress);
  await tx.wait();
  console.log(`Role ${role} granted to ${userAddress}`);
}

async function hasAnyRole(userAddress) {
  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid address");
  }
  console.log(`Checking roles for user ${userAddress}`);

  const singer = getSignerByAddress(ADMIN);
  const contract = new ethers.Contract(config.ACCESS_CONTROL_CONTRACT_ADDRESS, userABI, singer);

  return await contract.hasAnyRole(userAddress);
}

async function revokeRoleFromUser(userAddress, role) {
  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid Ethereum address");
  }
  if (!roleMap.includes(role)) {
    throw new Error("Invalid role");
  }
  const singer = getSignerByAddress(ADMIN);
  const contract = new ethers.Contract(config.ACCESS_CONTROL_CONTRACT_ADDRESS, userABI, singer);


  const tx = await contract.revokeRoleFrom(role, userAddress);
  await tx.wait();
  console.log(`Role ${role} revoked from ${userAddress}`);
}

// check address balance
async function checkAd1dressBalance(address) {
  if (!ethers.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
  const singer = getSignerByAddress(address);
  const provider = singer.provider || ethers.getDefaultProvider();
  if (!provider) {
    throw new Error("No provider found for the address");
  }
  const balance = await provider.getBalance(address);
  console.log(`Balance for address ${address}: ${balance} wei`);
  return balance.toString(); // Return balance as a string
}

const { isAddress, JsonRpcProvider, formatEther } = require("ethers");

// check balance
async function checkAddre2ssBalance(address) {


}

const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/d6763376844245e1a8eb410ea44713e3");


async function checkAddressBalance(address) {
  provider.checkAddressBalance = async (address) => {
    console.log( await provider.getBalance(address) ); // Log the balance in wei
  };
  if (!isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
  const balance = await provider.getBalance(address);
  console.log(`Balance for address ${address}: ${formatEther(balance)} ETH`);
  return formatEther(balance); // Return balance in ETH
}


module.exports = {
  grantRoleToUser,
  hasAnyRole,
  revokeRoleFromUser,
  checkAddressBalance,
};
