const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PlatformStatsService {
  async getStats() {
    try {
      const stats = await prisma.platformStats.findFirst();
      if (!stats) {
        // Initialize stats if they don't exist
        return await this.initializeStats();
      }
      return stats;
    } catch (error) {
      console.error('Error getting platform stats:', error);
      throw error;
    }
  }

  async initializeStats() {
    try {
      return await prisma.platformStats.create({
        data: {
          totalDonations: 0,
          totalAmount: 0,
          totalNgos: 0,
          totalDonors: 0,
          totalAmountDonatedToNgos: 0
        }
      });
    } catch (error) {
      console.error('Error initializing platform stats:', error);
      throw error;
    }
  }

  async updateStats() {
    try {
      const [
        totalDonations,
        totalAmount,
        totalNgos,
        totalDonors,
        totalAmountDonatedToNgos
      ] = await Promise.all([
        // Count only completed donations
        prisma.platformDonation.count({
          where: { status: 'COMPLETED' }
        }),
        // Sum only completed donations
        prisma.platformDonation.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED' }
        }),
        prisma.user.count({
          where: { role: 'NGO' }
        }),
        prisma.user.count({
          where: { role: 'DONATOR' }
        }),
        // Sum of approved fund requests
        prisma.fundRequest.aggregate({
          _sum: { amount: true },
          where: { status: 'APPROVED' }
        })
      ]);

      const stats = await prisma.platformStats.findFirst();
      if (!stats) {
        return await prisma.platformStats.create({
          data: {
            totalDonations,
            totalAmount: totalAmount._sum.amount || 0,
            totalNgos,
            totalDonors,
            totalAmountDonatedToNgos: totalAmountDonatedToNgos._sum.amount || 0
          }
        });
      }

      return await prisma.platformStats.update({
        where: { id: stats.id },
        data: {
          totalDonations,
          totalAmount: totalAmount._sum.amount || 0,
          totalNgos,
          totalDonors,
          totalAmountDonatedToNgos: totalAmountDonatedToNgos._sum.amount || 0
        }
      });
    } catch (error) {
      console.error('Error updating platform stats:', error);
      throw error;
    }
  }
}

module.exports = new PlatformStatsService(); 