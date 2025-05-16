import React from 'react';
import PlatformStats from './PlatformStats';
import PendingFundRequests from './PendingFundRequests';
import RequestHistory from './RequestHistory';
import './AdminStyles.css';

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <PlatformStats />
      <PendingFundRequests />
      <RequestHistory />
    </div>
  );
};

export default Dashboard; 