const db = require('../database'); 
async function getUserByWalletAddress(walletAddress) {
  const sql = `SELECT * FROM users WHERE wallet_address = ?`;
  return await db.get(sql, [walletAddress]);
}

async function getUserById(id) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  return await db.get(sql, [id]);
}

async function isUserRegistered(walletAddress) {
  const user = await getUserByWalletAddress(walletAddress);
  console.log("Checking if user is registered:", walletAddress, "Found:", user !== undefined);
  return user !== undefined;
}

async function addUser(walletAddress, role) {
  const sql = `INSERT INTO users (wallet_address, role) VALUES (?, ?)`;
  return await db.run(sql, [walletAddress, role]);
}

// validate user role
async function validateUserRole(walletAddress, expectedRole) {
  console.log("Validating user role for wallet address:", walletAddress, "Expected role:", expectedRole);
  const userRole = await getUserRoleByWalletAddress(walletAddress);
  console.log("User role found in db:", userRole, "Matches expected role:", expectedRole, "Result:", userRole === expectedRole);
  return userRole === expectedRole;
}

// get user role by wallet address
async function getUserRoleByWalletAddress(walletAddress) {
  const user = await getUserByWalletAddress(walletAddress);
  return user ? user['role'] : null;
}

// remove user address by wallet address
async function removeUser(walletAddress) {
  const sql = `DELETE FROM users WHERE wallet_address = ?`;
  return await db.run(sql, [walletAddress]);
}

// get all user data
async function getAllUsers() {
  const sql = `SELECT * FROM users`;
  return await db.all(sql);
}



module.exports = {  getUserByWalletAddress,
  isUserRegistered,
  addUser,
  validateUserRole,
  getUserRoleByWalletAddress,
  removeUser,
  getAllUsers,
  getUserById
};