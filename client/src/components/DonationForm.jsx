import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY_ID } from '../constants';
import './DonationForm.css';
import APP_CONSTANTS from '../constants';

const DonationForm = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadScript();
  }, []);

  const displayRazorpay = async (order) => {
    if (!scriptLoaded) {
      toast.error('Payment gateway is still loading. Please try again in a moment.');
      return;
    }
    console.log("order", order);
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.order.amount,
      currency: 'INR',
      name: 'GiveBack Platform',
      description: 'Thank you for your donation',
      order_id: order.order.id,
      handler: async function (response) {
        try {
          const token = localStorage.getItem('token');
          const result = await axios.post(
            `${APP_CONSTANTS.backendURL}/api/donations/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donationId: order.donationId
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (result.data.success) {
            toast.success('Payment successful! Thank you for your donation.');
            setAmount('');
          } else {
            console.log("result", result);
            toast.error('Payment verification failed');
          }
        } catch (error) {
          console.log("error", error);
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: JSON.parse(localStorage.getItem('user'))?.name || 'Donor',
        email: JSON.parse(localStorage.getItem('user'))?.email || 'donor@example.com',
      },
      theme: {
        color: '#d80032'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      toast.error('Payment failed. Please try again.');
    });
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${APP_CONSTANTS.backendURL}/api/donations/create-order`,
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await displayRazorpay(response.data);
    } catch (error) {
      toast.error('Failed to create payment order');
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <h2 className="donation-form-title">
        Support Our Platform
      </h2>
      <p className="donation-form-description">
        Your donation helps us maintain and improve our platform to better serve NGOs and donors.
      </p>
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="Enter amount"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="donate-button"
        >
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm; 