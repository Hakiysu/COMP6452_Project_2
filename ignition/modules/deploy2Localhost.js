// ignition/modules/deploy2Localhost.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LocalhostMeatBatchDeployment", (m) => {
  // Step 1: Deploy UserAccessControl
  const userAccessControl = m.contract("UserAccessControl");

  // Step 2: Deploy MeatBatchContract with userAccessControl address
  const meatBatch = m.contract("MeatBatchContract", [userAccessControl]);

  // Step 3: Set MeatBatchContract address in UserAccessControl (if needed, optional)
  
  // const setCall = m.call(userAccessControl, "setMeatBatchAddress", [meatBatch]); // 如果你有类似逻辑

  // Step 4: Grant ADMIN_ROLE to meatBatch contract (so it can manage roles)
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
