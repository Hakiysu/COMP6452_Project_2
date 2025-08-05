// scripts/simulateGas.js
const hre = require("hardhat");

async function main() {
  const [deployer, farmer1, farmer2, slaughterer, inspector, regulator] = await hre.ethers.getSigners();

  console.log("Deploying contracts with deployer:", deployer.address);

  const MeatBatchFactory = await hre.ethers.getContractFactory("MeatBatchContract");
  const meatBatch = await MeatBatchFactory.deploy();
  await meatBatch.waitForDeployment();
  console.log("MeatBatchContract deployed at:", meatBatch.target);

  const AccessManagerFactory = await hre.ethers.getContractFactory("AccessManager");
  const accessManager = await AccessManagerFactory.deploy(meatBatch.target);
  await accessManager.waitForDeployment();
  console.log("AccessManager deployed at:", accessManager.target);

  // 授权 AccessManager 为 DEFAULT_ADMIN_ROLE
  const ADMIN_ROLE = await meatBatch.DEFAULT_ADMIN_ROLE();
  const tx1 = await meatBatch.grantRole(ADMIN_ROLE, accessManager.target);
  await tx1.wait();

  // 赋予各个地址角色
  await accessManager.grantFarmer(farmer1.address);
  await accessManager.grantFarmer(farmer2.address);
  await accessManager.grantRoleTo(slaughterer.address, "SLAUGHTER_ROLE");
  await accessManager.grantRoleTo(inspector.address, "INSPECTOR_ROLE");
  await accessManager.grantRoleTo(regulator.address, "REGULATOR_ROLE");

  const actions = [];

  // Farmer1 创建一个批次
  actions.push(await meatBatch.connect(farmer1).createBatch("B001", "Cow"));
  actions.push(await meatBatch.connect(farmer1).feedBatch("B001", "fed by farmer1"));

  // Farmer2 创建另一个批次
  actions.push(await meatBatch.connect(farmer2).createBatch("B002", "Pig"));
  actions.push(await meatBatch.connect(farmer2).feedBatch("B002", "fed by farmer2"));

  // Slaughter 操作
  actions.push(await meatBatch.connect(slaughterer).slaughterBatch("B001", "slaughter info 1"));
  actions.push(await meatBatch.connect(slaughterer).slaughterBatch("B002", "slaughter info 2"));

  // Inspect -> 一个 pass，一个 reject
  actions.push(await meatBatch.connect(inspector).inspectBatchPass("B001", "looks good"));
  actions.push(await meatBatch.connect(inspector).inspectBatchReject("B002", "bad quality"));

  // Regulator 尝试 approve B001（成功）与 B002（失败）
  actions.push(await meatBatch.connect(regulator).approveBatch("B001", "approved"));
  try {
    await meatBatch.connect(regulator).approveBatch("B002", "should fail");
  } catch (e) {
    console.log("Expected failure on approving rejected batch:", e.message);
  }

  // 计算每笔操作的 gas
  for (let i = 0; i < actions.length; i++) {
    const receipt = await actions[i].wait();
    console.log(`Action ${i + 1} Gas used:`, receipt.gasUsed.toString());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
