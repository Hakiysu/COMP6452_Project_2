// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const FactoryMB = await ethers.getContractFactory("MeatBatchContract");
  const meatBatch = await FactoryMB.deploy();
  await meatBatch.waitForDeployment(); // 推荐新版 API

  const mbTx = await meatBatch.deploymentTransaction();
  const mbReceipt = await mbTx.wait(1);
  console.log("MeatBatchContract deployed at:", meatBatch.target ?? meatBatch.address);
  console.log("Gas used:", mbReceipt.gasUsed.toString());

  const FactoryAM = await ethers.getContractFactory("AccessManager");
  const accessManager = await FactoryAM.deploy(meatBatch.target ?? meatBatch.address);
  await accessManager.waitForDeployment();

  const amTx = await accessManager.deploymentTransaction();
  const amReceipt = await amTx.wait(1);
  console.log("AccessManager deployed at:", accessManager.target ?? accessManager.address);
  console.log("Gas used:", amReceipt.gasUsed.toString());

  const feeData = await ethers.provider.getFeeData();
  const price = feeData.gasPrice ?? ethers.parseUnits("20", "gwei");
  const costMB = price * mbReceipt.gasUsed;
  const costAM = price * amReceipt.gasUsed;
  console.log("Estimated ETH cost:");
  console.log(" - MeatBatch:", ethers.formatEther(costMB));
  console.log(" - AccessManager:", ethers.formatEther(costAM));
  console.log(" - Total:", ethers.formatEther(costMB + costAM));
}

main().catch(console.error);
