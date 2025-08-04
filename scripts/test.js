// scripts/verifyGrantRole.js
const { ethers } = require("hardhat");

async function main() {
  const meatBatchAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const accessManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const meatBatch = await ethers.getContractAt("MeatBatchContract", meatBatchAddress);

  const DEFAULT_ADMIN_ROLE = await meatBatch.DEFAULT_ADMIN_ROLE();

  const hasRole = await meatBatch.hasRole(DEFAULT_ADMIN_ROLE, accessManagerAddress);

  console.log(`\nAccessManager has DEFAULT_ADMIN_ROLE in MeatBatchContract:`, hasRole ? "✅ Yes" : "❌ No");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
