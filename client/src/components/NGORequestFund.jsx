import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import APP_CONSTANTS from '../constants';
import './NGORequestFund.css';

const NGORequestFund = () => {
    console.log("NGORequestFund");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.purpose) {
      newErrors.purpose = 'Please enter the purpose';
    }
    if (!formData.description) {
      newErrors.description = 'Please provide a description';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to request funds');
        return;
      }

      const response = await axios.post(
        `${APP_CONSTANTS.backendURL}/api/fund-requests`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Fund request submitted successfully!');
      navigate('/fund-requests-history');
    } catch (error) {
      console.error('Error submitting fund request:', error);
      toast.error(error.response?.data?.message || 'Error submitting fund request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ngo-request-fund-container">
      <h2 className="request-fund-heading">Request Funds</h2>
      <form onSubmit={handleSubmit} className="request-fund-form">
      <div className="form-group">
          <label htmlFor="purpose">Purpose</label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Enter purpose of the fund request"
            className={errors.purpose ? 'error' : ''}
          />
          {errors.purpose && <span className="error-message">{errors.purpose}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (INR)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount in INR"
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed description of how the funds will be used"
            className={errors.description ? 'error' : ''}
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default NGORequestFund; 