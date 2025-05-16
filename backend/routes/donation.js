const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const platformStatsService = require('../services/platformStats');
const blockchainService = require('../services/blockchainService');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create platform donation order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Create donation record with donor ID
    const donation = await prisma.platformDonation.create({
      data: {
        amount,
        razorpayOrderId: order.id,
        status: 'PENDING',
        donorId: req.user.id
      }
    });

    res.json({
      order,
      donationId: donation.id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify platform donation
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, donationId } = req.body;

    // Verify payment
    const crypto = require('crypto');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Find the donation first
      const existingDonation = await prisma.platformDonation.findFirst({
        where: {
          id: donationId,
          status: 'PENDING'
        },
        include: {
          donor: {
            select: {
              name: true
            }
          }
        }
      });

      if (!existingDonation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Donation not found or already processed' 
        });
      }

      // Update donation status
      const donation = await prisma.platformDonation.update({
        where: {
          id: donationId,
        },
        data: {
          status: 'COMPLETED',
          razorpayPaymentId: razorpay_payment_id
        }
      });

      // Record donation on blockchain
      try {
        await blockchainService.recordPlatformDonation(
          donationId,
          existingDonation.donor.name,
          existingDonation.amount
        );
      } catch (blockchainError) {
        console.error('Error recording donation on blockchain:', blockchainError);
        // Continue even if blockchain recording fails
      }

      // Update platform stats
      await platformStatsService.updateStats();

      res.json({ success: true, donation });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying platform donation:', error);
    res.status(500).json({ success: false, message: 'Error verifying donation' });
  }
});

// Verify NGO donation
router.post('/verify-ngo', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, ngoId } = req.body;

    // Verify payment
    const crypto = require('crypto');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update donation status
      const donation = await prisma.platformDonation.update({
        where: { id: donationId },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          status: 'COMPLETED'
        }
      });

      // Update platform stats
      await platformStatsService.updateStats();

      res.json({ success: true, donation });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying NGO donation:', error);
    res.status(500).json({ success: false, message: 'Error verifying donation' });
  }
});

// Get all platform donations (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const donations = await prisma.platformDonation.findMany({
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(donations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all completed donations for the authenticated user
router.get('/user/completed', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const donations = await prisma.platformDonation.findMany({
      where: {
        donorId: userId,
        status: 'COMPLETED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ 
      success: true, 
      donations 
    });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching donations' 
    });
  }
});

module.exports = router; 