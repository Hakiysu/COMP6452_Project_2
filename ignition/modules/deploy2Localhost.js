// ignition/modules/deploy2Localhost.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LocalhostMeatBatchDeployment", (m) => {
  const userAccessControl = m.contract("UserAccessControl");
  const meatBatch = m.contract("MeatBatchContract", [userAccessControl]);
  const ADMIN_ROLE = m.staticCall(userAccessControl, "ADMIN_ROLE");

  m.call(userAccessControl, "grantRoleTo", [
    "ADMIN_ROLE",
    meatBatch,
  ]);

  return {
    userAccessControl,
    meatBatch,
  };
});
