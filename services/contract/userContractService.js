// user contract service
const { ethers } = require("ethers");
const config = require("../../config");
const user = require("../../artifacts/contracts/UserAccessControl.sol/AccessManager.json");

const userABI = user.abi;
const provider = new ethers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.ACCESS_CONTROL_CONTRACT_ADDRESS, userABI, signer);

// ✅ 通用授权方法
async function grantRoleToUser(userAddress, role) {
  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid Ethereum address");
  }

  const methodMap = {
    FARMER_ROLE: "grantFarmer",
    SLAUGHTER_ROLE: "grantSlaughter",
    INSPECTOR_ROLE: "grantInspector",
    REGULATOR_ROLE: "grantRegulator",
    CONSUMER_ROLE: "grantConsumer",
  };

  const grantMethod = methodMap[role];
  if (!grantMethod || !contract[grantMethod]) {
    throw new Error("Invalid role");
  }

  const tx = await contract[grantMethod](userAddress);
  await tx.wait();
  console.log(`✅ Role ${role} granted to ${userAddress}`);
}

// ✅ 查询某用户是否有任何角色
async function hasAnyRole(userAddress) {
  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid address");
  }
  return await contract.hasAnyRole(userAddress);
}

// get user by address
async function getUserByAddress(address) {
  if (!ethers.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
}

module.exports = {
  grantRoleToUser,
  hasAnyRole,
  getUserByAddress
};
