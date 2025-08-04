// controllers/userController.js
const userService = require('../services/userService');
const userContractService = require('../services/contract/userContractService');
const { ethers } = require('ethers');

//add user
exports.addUser = async (req, res) => {
  const { address, role } = req.body;
  try {
    if (!role || !address) {
      return res.status(400).send({ error: "Role and address are required" });
    }
    // if it a legal wallet address ：ethers.isAddress
    if (!ethers.isAddress(address)) {
      return res.status(400).send({ error: "Invalid Ethereum address" });
    }
    await userContractService.grantRoleToUser(address, role);
    await userService.addUser(address, role);
    res.status(201).send({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send({ error: error.message });
  }
};

// remove user
exports.removeUser = async (req, res) => {
  const { address } = req.body;
  try {
    
    const role = await userService.getUserRoleByWalletAddress(address);
    console.log(`Removing user with address: ${address} and role: ${role}`);
    await userContractService.revokeRoleFromUser(address, role);
    await userService.removeUser(address);
    res.status(200).send({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).send({ error: error.message });
  }
};
