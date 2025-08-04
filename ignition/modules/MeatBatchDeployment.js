// ignition/modules/MeatBatchDeployment.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MeatBatchDeployment", (m) => {
  const meatBatch = m.contract("MeatBatchContract");

  const accessManager = m.contract("AccessManager", [meatBatch]);

  // 授权 AccessManager 拥有 DEFAULT_ADMIN_ROLE
  const DEFAULT_ADMIN_ROLE = m.staticCall(meatBatch, "DEFAULT_ADMIN_ROLE");

  m.call(meatBatch, "grantRole", [
    DEFAULT_ADMIN_ROLE,
    accessManager,
  ]);

  return { meatBatch, accessManager };
});
