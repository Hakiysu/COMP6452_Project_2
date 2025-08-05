const { INTERNAL } = require("sqlite3");

require("@nomicfoundation/hardhat-toolbox");

// const { vars } = require("hardhat/config");

const INFURA_API_KEY = "API_KEY"; // Replace with your Infura API key


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.1:8545"
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`PRIVATE_KEY`], 
    }
  },
};
