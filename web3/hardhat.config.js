require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  mocha: {
    timeout: 3600000,
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500,
      },
    },
  },
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: 'https://testnet.hashio.io/api',
      accounts: ['Private key'],
      chainId: 296,  // Hedera testnet chain ID
    },
  },
};
