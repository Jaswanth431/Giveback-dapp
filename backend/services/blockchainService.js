const { ethers } = require('ethers');
const APP_CONSTANTS = require('../constants');
const abi = require('../abi');

class BlockchainService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
    this.initializeContract();
  }

  async initializeContract() {
    try {
      // Initialize provider with admin's private key
      this.provider = new ethers.JsonRpcProvider(APP_CONSTANTS.HEDERA_RPC_URL);
      this.signer = new ethers.Wallet(APP_CONSTANTS.ADMIN_PRIVATE_KEY, this.provider);
      
      // Initialize contract with signer
      this.contract = new ethers.Contract(
        APP_CONSTANTS.CONTRACT_ADDRESS,
        abi,
        this.signer
      );
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      throw error;
    }
  }

  async recordPlatformDonation(donationId, donorName, amount) {
    try {
      const tx = await this.contract.donateToPlatform(
        donorName,  // string _donorName
        amount,     // uint256 _amount
        donationId, // string _id
        {
          gasLimit: APP_CONSTANTS.GAS_LIMIT,
          gasPrice: ethers.parseUnits('500', 'gwei')
        }
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error recording platform donation:', error);
      throw error;
    }
  }

  async recordFundRequest(ngoId, ngoName, amount) {
    try {
      const tx = await this.contract.createFundRequest(
        ngoId,      // address _ngoId
        ngoName,    // string _ngoName
        amount,     // uint256 _amount
        {
          gasLimit: APP_CONSTANTS.GAS_LIMIT,
          gasPrice: ethers.parseUnits('500', 'gwei')
        }
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error recording fund request:', error);
      throw error;
    }
  }

  async getPlatformDonations() {
    try {
      return await this.contract.getPlatformDonations();
    } catch (error) {
      console.error('Error fetching platform donations:', error);
      throw error;
    }
  }

  async getFundRequests() {
    try {
      return await this.contract.getFundRequests();
    } catch (error) {
      console.error('Error fetching fund requests:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService(); 