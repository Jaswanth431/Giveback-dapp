import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import APP_CONSTANTS from '../constants';
import Spinner from '../assets/spinner.svg';
import './FundRequestHistory.css';

const FundRequestHistory = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFundRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view fund requests');
        return;
      }

      const response = await axios.get(
        `${APP_CONSTANTS.backendURL}/api/fund-requests/my-requests`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setFundRequests(response.data);
    } catch (error) {
      console.error('Error fetching fund requests:', error);
      toast.error('Error fetching fund requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundRequests();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={Spinner} alt="Loading..." className="spinner" />
      </div>
    );
  }

  return (
    <div className="fund-request-history-container">
      <h2 className="history-heading">Fund Request History</h2>
      
      {fundRequests.length === 0 ? (
        <p className="no-requests">No fund requests found.</p>
      ) : (
        <div className="requests-list">
          {fundRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-details">
                <div className="request-header">
                  <h3 className="request-amount">₹{request.amount.toLocaleString()}</h3>
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="request-info">
                  <p className="request-purpose">
                    <strong>Purpose:</strong> {request.purpose}
                  </p>
                  <p className="request-description">
                    <strong>Description:</strong> {request.description}
                  </p>
                  <p className="request-date">
                    <strong>Requested on:</strong> {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundRequestHistory; 