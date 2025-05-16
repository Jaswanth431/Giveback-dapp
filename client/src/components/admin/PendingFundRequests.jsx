import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import APP_CONSTANTS from '../../constants';
import './AdminStyles.css';

const PendingFundRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${APP_CONSTANTS.backendURL}/api/admin/pending-requests`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Error fetching pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${APP_CONSTANTS.backendURL}/api/admin/update-request/${requestId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Pending Fund Requests</h2>
      {requests.length === 0 ? (
        <p className="no-data">No pending requests found.</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>Request from {request.ngo.name}</h3>
                <span className="amount">₹{request.amount.toLocaleString()}</span>
              </div>
              
              <div className="request-details">
                <p><strong>Purpose:</strong> {request.purpose}</p>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>NGO Contact:</strong> {request.ngo.phoneNumber}</p>
                <p><strong>NGO Email:</strong> {request.ngo.email}</p>
                <p><strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="request-actions">
                <button
                  className="btn-approve"
                  onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                >
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingFundRequests; 