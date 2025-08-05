// ignition/modules/deploy2Sepolia.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SepoliaMeatBatchDeployment", (m) => {
  const userAccessControl = m.contract("UserAccessControl");

  const meatBatch = m.contract("MeatBatchContract", [userAccessControl]);

  const ADMIN_ROLE = m.staticCall(userAccessControl, "ADMIN_ROLE");

   m.call(userAccessControl, "grantRoleTo", [
    "ADMIN_ROLE",
    meatBatch,
  ]);

  return { meatBatch, userAccessControl };
});
