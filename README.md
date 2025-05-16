# Giveback-dapp

## Overview
Giveback-dapp is a decentralized fundraising application built using the Hedera Hashgraph network. It enables users to create fundraising campaigns, donate using HBAR, and track donations with real-time transparency and security through the blockchain.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Blockchain**: Hedera Hashgraph (Smart Contracts and HBAR cryptocurrency)

---

## Steps to Deploy and Run the Project

- ### Step 1: Install Dependencies

   1. Navigate to the `web3` directory and install the necessary dependencies:
      ```bash
      cd web3
      npm install
      ```
   2. Navigate to the `backend` and `client` directories and install their respective dependencies:
      ```bash
      cd ../backend
      npm install
      cd ../client
      npm install
      ```
- ### Step 2: Set Up Hardhat for Hedera
   Your `hardhat.config.js` file in the `web3` folder should look like this, Update your private key here:
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
   
- ### Step 3: Deploy the Contract

   The deployment script is already present. You just need to run the following command to deploy the contract to the Hedera Testnet:
   ```bash
   npx hardhat run scripts/deployContract.js --network hedera
   ```

- ### Step 4: Locate the ABI and Bytecode

   After deploying the contract, you can find the **ABI** and **Bytecode** in the following locations:
   
   - **ABI**: Navigate to the `artifacts/contracts/CrowdFunding.json` file. The ABI (Application Binary Interface) can be found under the `abi` section of the JSON file.
   
   - **Bytecode**: In the same `CrowdFunding.json` file, you can find the **bytecode** under the `bytecode` section.
   
   You will need both the **ABI** and the **contract address** to integrate with your backend and frontend.

- ### Step 5: Copy ABI to Backend

   1. Navigate to the `artifacts/contracts/CrowdFunding.json` file in the `web3` folder.
   2. Copy the **ABI** section from this JSON file.
   3. Create a new file in the **backend** directory called `abi.js`.
   4. Paste the copied **ABI** into this `abi.js` file.

   You can refer to a sample `abi.js` file already available in the repository for guidance on how to format and structure this file.

- ### Step 6: Add Contract Address to Backend

   1. Open the `index.js` file in the **backend** directory.
   2. Replace the placeholder contract address with the actual contract address you obtained after deploying the contract:
   ```javascript
   const contractAddress = 'Your_Contract_Address';  // Replace with the actual contract address
   ```

- ### Step 7: Run the Backend

   1. Once you've added the ABI and updated the contract address in `index.js`, you can now run the backend server.
   2. Navigate to the **backend** directory:
   ```bash
   cd backend
   npm run dev
   ```
- ### Step 8: Add ABI and Bytecode in the Frontend (Client Directory)

   1. Navigate to the `client/src/hedera/contracts/` folder inside the **client** directory.
   2. Replace the contents of `abi.js` with the **ABI** that you copied from the `artifacts/contracts/CrowdFunding.json` file in the `web3` folder.
   3. Similarly, replace the contents of `bytecode.js` with the **bytecode** from the same `CrowdFunding.json` file.
   
   These files in the **client** directory are crucial for interacting with the deployed contract on the frontend. Ensure that both the ABI and Bytecode are updated correctly for the frontend to communicate properly with the smart contract.

- ### Step 9: Add Contract Address in the Frontend (Client/src Directory)

   1. Open the `constants.js` file located in the `client/src/` directory.
   2. Update the `contractAddress` value with the actual contract address obtained during deployment:
   ```javascript
   const APP_CONSTANTS = {
       backendURL: "http://localhost:3000",
       contractAddress: "Your_Contract_Address"  // Replace with your actual contract address
   };

   export default APP_CONSTANTS;
   ```

- ### Step 10: Set Up MetaMask Integration

   1. **Install MetaMask**: Instruct users to install the [MetaMask](https://metamask.io/download/) browser extension or mobile app if they haven't done so already.
   
   2. **Add Hedera Testnet to MetaMask**:
      - Open MetaMask and go to the networks dropdown (top right).
      - Click **Add Network**.
      - Add the following details for the Hedera Testnet:
        - **Network Name**: Hedera Testnet
        - **New RPC URL**: https://testnet.hashio.io/api
        - **Chain ID**: 296
        - **Currency Symbol**: HBAR

      - Save the network, and make sure to switch to the Hedera Testnet in MetaMask.

- ### Step 11: Run the Frontend

   1. After setting up MetaMask and updating the contract address and ABI, you can now run the frontend.
   2. Navigate to the **client** directory:
   ```bash
   cd client
   npm run dev
   ```
   





   
