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


