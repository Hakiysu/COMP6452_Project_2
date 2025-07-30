// ignition/modules/MeatBatchModule.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MeatBatch", (m) => {
  const meatBatch = m.contract("MeatBatch", ["batch001"]);
  return { meatBatch };
});
