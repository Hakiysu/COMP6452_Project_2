const express = require("express");
const router = express.Router();

// index
router.get('/', (req, res) => {
  res.send(`<h1>User Address Management</h1>
    <form action="/user/add" method="post">
      <input type="text" name="userId" placeholder="User ID" required />
      <input type="text" name="address" placeholder="Address" required />
      <button type="submit">Add Address</button>
    </form>
    <form action="/user/remove" method="post">
      <input type="text" name="address" placeholder="Address" required />
      <button type="submit">Remove Address</button>
    </form>
  `);
});


// add new user address into local db
router.post('/add', (req, res) => {
  const { userId, address } = req.body;
  // TODO: Add logic to save the address to the database
  res.status(201).send({ message: "Address added successfully" });
});


// get user address by userId
router.get('/:userId/address', (req, res) => {
  const userId = req.params.userId;
  // TODO: Add logic to retrieve the address from the database
  res.status(200).send({ message: "Address retrieved successfully" });
});

// remove user address by address
router.delete('/remove', (req, res) => {
  const { address } = req.body;
  // TODO: Add logic to remove the address from the database
  res.status(200).send({ message: "Address removed successfully" });
});

