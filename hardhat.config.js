require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.8.13" }
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.POLYGON_NETWORK,
        blockNumber: 53197367
      }
    }
  }
  
};
