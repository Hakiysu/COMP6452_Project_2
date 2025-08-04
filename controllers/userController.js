// controllers/userController.js
const userService = require('../services/userService');


const userContractService = require('../services/contract/userContractService');


//add user
exports.addUser = async (req, res) => {
  const { address, role } = req.body;
  try {
    await userService.addUser(address, role);
    await userContractService.grantRoleToUser(address, role);
    res.status(201).send({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send({ error: "Internal server error" });
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
    res.status(500).send({ error: "Internal server error" });
  }
};
