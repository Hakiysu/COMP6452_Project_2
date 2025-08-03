const db = require('../database');

async function getUserByWallet(walletAddress) {
  const sql = `SELECT * FROM users WHERE walletAddress = ?`;
  return await db.get(sql, [walletAddress]);
}

async function isUserRegistered(walletAddress) {
  const user = await getUserByWallet(walletAddress);
  return !!user;
}

async function addUser(walletAddress, role) {
  const sql = `INSERT INTO users (walletAddress, role) VALUES (?, ?)`;
  return await db.run(sql, [walletAddress, role]);
}

// validate user role
async function validateUserRole(walletAddress, expectedRole) {
  const user = await getUserByWallet(walletAddress);
  return user && user.role === expectedRole;
}