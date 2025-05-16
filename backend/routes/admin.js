const express = require('express');
const router = express.Router();
const platformStatsService = require('../services/platformStats');
const blockchainService = require('../services/blockchainService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth, adminAuth } = require('../middleware/auth');

// Get platform statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = await platformStatsService.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting platform stats:', error);
    res.status(500).json({ success: false, message: 'Error getting platform stats' });
  }
});

// Get pending fund requests
router.get('/pending-requests', auth, adminAuth, async (req, res) => {
  try {
    const pendingRequests = await prisma.fundRequest.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        ngo: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      },
      orderBy: [
        { amount: 'asc' },  // Sort by amount ascending (smallest first)
        { createdAt: 'desc' } // Then by creation date descending
      ]
    });

    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Error fetching pending requests' });
  }
});

// Get all fund requests history
router.get('/request-history', auth, adminAuth, async (req, res) => {
  try {
    const allRequests = await prisma.fundRequest.findMany({
      include: {
        ngo: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(allRequests);
  } catch (error) {
    console.error('Error fetching request history:', error);
    res.status(500).json({ message: 'Error fetching request history' });
  }
});

// Update fund request status and check available balance before approving
router.put('/update-request/:id', auth, adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Get the request first to check amount and get NGO details
    const request = await prisma.fundRequest.findUnique({
      where: { id: id },
      include: {
        ngo: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // If approving, check if there's enough balance

    console.log(request);
    if (status === 'APPROVED') {
      const stats = await platformStatsService.getStats();
      const availableBalance = stats.totalAmount - stats.totalAmountDonatedToNgos;
      
      if (availableBalance < request.amount) {
        return res.status(400).json({ 
          success: false,
          message: 'Insufficient platform balance to approve this request' 
        });
      }

      // Record the fund request on the blockchain
      try {
        await blockchainService.recordFundRequest(
          id,
          request.ngo.name,
          request.amount
        );
      } catch (blockchainError) {
        console.error('Error recording fund request on blockchain:', blockchainError);
        // Continue even if blockchain recording fails
      }
    }

    // Update request status
    const updatedRequest = await prisma.fundRequest.update({
      where: { id: id },
      data: { status },
    });

    // Update platform stats
    await platformStatsService.updateStats();

    res.json({ 
      success: true, 
      message: 'Fund request updated successfully', 
      updatedRequest 
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ success: false, message: 'Error updating request' });
  }
});

module.exports = router; 