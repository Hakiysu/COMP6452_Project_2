// ignition/modules/MeatBatchModule.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MeatBatchModule", (m) => {
  const meatBatch = m.contract("MeatBatchContract");
  return { meatBatch };
});
