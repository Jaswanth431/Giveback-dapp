import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import APP_CONSTANTS from '../../constants';
import './AdminStyles.css';

const PlatformStats = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalNgos: 0,
    totalDonors: 0,
    totalAmountDonatedToNgos: 0
  });
  console.log(stats);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${APP_CONSTANTS.backendURL}/api/admin/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStats(response.data.stats);
      console.log(response.data.stats);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      toast.error('Error fetching platform statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const platformBalance = stats.totalAmount - stats.totalAmountDonatedToNgos;

  return (
    <div className="admin-container">
      <h2>Platform Statistics</h2>
      <div className="stats-grid">
        {/* Key Figures - Highlighted */}
        <div className="stat-card balance-card">
          <h3>Platform Balance</h3>
          <p className="stat-value">₹{platformBalance.toLocaleString()}</p>
        </div>
        <div className="stat-card ngo-card">
          <h3>Total Donated to NGOs</h3>
          <p className="stat-value">₹{stats.totalAmountDonatedToNgos.toLocaleString()}</p>
        </div>
        <div className="stat-card total-amount-card">
          <h3>Total Amount</h3>
          <p className="stat-value">₹{stats.totalAmount.toLocaleString()}</p>
        </div>

        {/* Secondary Stats */}
        <div className="stat-card">
          <h3>Total Donations</h3>
          <p className="stat-value">{stats.totalDonations}</p>
        </div>
        <div className="stat-card">
          <h3>Total NGOs</h3>
          <p className="stat-value">{stats.totalNgos}</p>
        </div>
        <div className="stat-card">
          <h3>Total Donors</h3>
          <p className="stat-value">{stats.totalDonors}</p>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats; 