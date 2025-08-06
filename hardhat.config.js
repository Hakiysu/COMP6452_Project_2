require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.1:8545"
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/d6763376844245e1a8eb410ea44713e3`,
      accounts: [`c1dd5d81caa20d5e723908150d8d9111bb918544bd348c9d8c11209d6d532236`], 
    }
  },
};
