const express = require("express");
const router = express.Router();

const userService = require("../services/userService");
const userController = require("../controllers/userController");

// index
router.get('/', (req, res) => {
  res.send(`<h1>User Address Management</h1>
    <form action="/user/add" method="post">
      <input type="text" name="userId" placeholder="User ID" required />
      <input type="text" name="address" placeholder="Address" required />
      <select name="role" required>
        <option value="Farmer">Farmer</option>
        <option value="Regulator">Regulator</option>
        <option value="Retailer">Retailer</option>
      </select>
      <button type="submit">Add Address</button>
    </form>
    <form action="/user/remove" method="post">
      <input type="text" name="address" placeholder="Address" required />
      <button type="submit">Remove Address</button>
    </form>
    <form action="/user/:address" method="get">
      <input type="text" name="address" placeholder="Address" required />
      <button type="submit">Get User Role</button>
    </form>
    <form action="/user/:address/role" method="get">
      <input type="text" name="address" placeholder="Address" required />
      <button type="submit">Get User Role</button>
    </form>
  `);
});


// add new user address into local db
router.post('/add', async (req, res) => {
  const { address, role } = req.body;
  // TODO: Add logic to save the address to the database
  try {
    if (!role || !address) {
      return res.status(400).send({ error: "Role and address are required" });
    }
    console.log(`Adding address for user with role ${role}:`, address);
    // if user is registered, not allow to add address
    const isRegistered = await userService.isUserRegistered(address);
    if (isRegistered) {
      console.error("User is already registered:", address);
      return res.status(400).send({ error: "User is already registered" });
    }
    // controller add
    await userController.addUser(req, res);
  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// get user data by user address
router.get('/get/:address', async (req, res) => {
  const address = req.params.address;
  // TODO: Add logic to retrieve the user data from the database
  try {
    const user = await userService.getUserByWalletAddress(address);
    return res.status(200).send({ message: "User data retrieved successfully", user });
  } catch (error) {
    console.error("Error retrieving address:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// remove user address by address
router.post('/remove', async (req, res) => {
  const { address } = req.body;
  // TODO: Add logic to remove the address from the database
  try {
    if (!address) {
      return res.status(400).send({ error: "Address is required" });
    }
    // if not exist, cannot remove
    const isRegistered = await userService.isUserRegistered(address);
    if (!isRegistered) {
      console.error("User is not exists:", address);
      return res.status(400).send({ error: "User is not exists" });
    }
    await userController.removeUser(req, res);
  } catch (error) {
    console.error("Error removing address:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});


//get user role by address
router.get('/:address/role', async (req, res) => {
    const address = req.params.address;
    // TODO: Add logic to retrieve the user role from the database
    const role = await userService.getUserRoleByWalletAddress(address);
    return res.status(200).send({ message: "User role retrieved successfully", userRole: role});
});

// get all users
router.get('/all', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send({ message: "All users retrieved successfully", users });
  } catch (error) {
    console.error("Error retrieving all users:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// check user balance
router.post('/balance', async (req, res) => {
  const { address } = req.body;
  try {
    if (!address) {
      return res.status(400).send({ error: "Address is required" });
    }
    // if not exist, cannot check balance
    const isRegistered = await userService.isUserRegistered(address);
    if (!isRegistered) {
      console.error("User is not exists:", address);
      return res.status(400).send({ error: "User is not exists" });
    }
    await userController.checkUserBalance(req, res);
  } catch (error) {
    console.error("Error checking user balance:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});



module.exports = router;