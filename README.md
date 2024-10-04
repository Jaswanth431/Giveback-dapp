# Giveback-dapp

## Overview
Giveback-dapp is a decentralized fundraising application built using the Hedera Hashgraph network. It enables users to create fundraising campaigns, donate using HBAR, and track donations with real-time transparency and security through the blockchain.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Blockchain**: Hedera Hashgraph (Smart Contracts and HBAR cryptocurrency)
- **Database**: PostgreSQL (for off-chain data storage)
- **Web3**: Hardhat, Ethers.js

---

## Steps to Deploy and Run the Project

### Step 1: Install Dependencies

1. Navigate to the `web3` directory and install the necessary dependencies:
   ```bash
   cd web3
   npm install
   ```
2. Navigate to the `backend` and `client` directories and install their respective dependencies:
   ```
   cd ../backend
  npm install
  
  cd ../client
  npm install
   ```

### Step 2: Set Up Hardhat for Hedera

Your `hardhat.config.js` file in the `web3` folder should look like this:

```javascript
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
      accounts: ['Private key'],  // Replace with your Hedera testnet private key
      chainId: 296,  // Hedera testnet chain ID
    },
  },
};
```

