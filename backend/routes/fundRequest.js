const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');
const platformStatsService = require('../services/platformStats');

const prisma = new PrismaClient();

// Create fund request (NGO)
router.post('/', auth, async (req, res) => {
  
  try {
    if (req.user.role !== 'NGO') {
      return res.status(403).json({ error: 'Only NGOs can create fund requests' });
    }

    const { amount, purpose, description } = req.body;

    const fundRequest = await prisma.fundRequest.create({
      data: {
        ngoId: req.user.id,
        amount:parseInt(amount),
        purpose,
        description,
        status: 'PENDING'
      }
    });


    res.status(201).json({ success: true, message: 'Fund request created successfully', fundRequest });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Get NGO's fund requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const fundRequests = await prisma.fundRequest.findMany({
      where: { ngoId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(fundRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all fund requests (Admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const fundRequests = await prisma.fundRequest.findMany({
      include: {
        ngo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(fundRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 