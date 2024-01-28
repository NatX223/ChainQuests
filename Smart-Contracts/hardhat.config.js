require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.20",
        settings: {},
      },
    ],
  },
  networks: {
    hardhat: {
    },
    Pegasus: {
      url: "https://replicator.pegasus.lightlink.io/rpc/v1",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};