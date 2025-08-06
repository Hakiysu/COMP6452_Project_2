require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
const data = require("./data.json");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.1:8545"
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${data.INFURA_API_KEY}`,
      accounts: [`${data.ADMIN_PRIVATE_KEY}`], 
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: data.ETHERSCAN_API_KEY,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }
};
