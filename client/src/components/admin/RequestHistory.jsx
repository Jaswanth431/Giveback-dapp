import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import APP_CONSTANTS from '../../constants';
import './AdminStyles.css';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(requests);
  const fetchRequestHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${APP_CONSTANTS.backendURL}/api/admin/request-history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching request history:', error);
      toast.error('Error fetching request history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Fund Request History</h2>
      {requests.length === 0 ? (
        <p className="no-data">No requests found.</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>Request from {request.ngo.name}</h3>
                <div className="header-right">
                  <span className="amount">₹{request.amount.toLocaleString()}</span>
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
              
              <div className="request-details">
                <p><strong>Purpose:</strong> {request.purpose}</p>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>NGO Contact:</strong> {request.ngo.phoneNumber}</p>
                <p><strong>NGO Email:</strong> {request.ngo.email}</p>
                <p><strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                <p><strong>Status updated on:</strong> {new Date(request.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestHistory; 