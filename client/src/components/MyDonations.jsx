import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useWallet from '../usewallet';
import APP_CONSTANTS from '../constants';
import Spinner from '../assets/spinner.svg';
import { toast, ToastContainer } from 'react-toastify';
import './MyDonations.css';

const MyDonations = () => {
  const [cryptoDonations, setCryptoDonations] = useState([]);
  const [inrDonations, setInrDonations] = useState([]);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [loadingInr, setLoadingInr] = useState(true);
  const { address } = useWallet();

  const fetchCryptoDonations = async () => {
    if (!address) {
      setLoadingCrypto(false);
      return;
    }

    try {
      setLoadingCrypto(true);
      const response = await axios.post(`${APP_CONSTANTS.backendURL}/mydonations`, {
        address,
      });
      console.log(response);
      if (response.data.success) {
        setCryptoDonations(response.data.donations || []);
      } else {
        toast.error('Failed to fetch crypto donations.');
        setCryptoDonations([]);
      }
    } catch (error) {
      console.error('Error fetching crypto donations:', error);
      toast.error('Error fetching crypto donations.');
      setCryptoDonations([]);
    } finally {
      setLoadingCrypto(false);
    }
  };

  const fetchInrDonations = async () => {
    try {
      setLoadingInr(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingInr(false);
        setInrDonations([]);
        return;
      }

      const response = await axios.get(`${APP_CONSTANTS.backendURL}/api/donations/user/completed`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setInrDonations(response.data.donations);
    } catch (error) {
      console.error('Error fetching INR donations:', error);
      toast.error('Error fetching INR donations.');
      setInrDonations([]);
    } finally {
      setLoadingInr(false);
    }
  };

  useEffect(() => {
    fetchCryptoDonations();
    fetchInrDonations();
  }, [address]);

  const renderCryptoDonations = () => {
    if (!address) {
      return <p className="no-donations">Please connect your wallet to view crypto donations</p>;
    }

    if (loadingCrypto) {
      return (
        <div className="spinner-container">
          <img src={Spinner} alt="Loading..." className="spinner" />
        </div>
      );
    }

    if (cryptoDonations.length === 0) {
      return <p className="no-donations">No crypto donations found.</p>;
    }

    return (
      <div className="donations-grid">
        {cryptoDonations.map((donation, index) => (
          <div key={index} className="donation-card">
            <div className="donation-details">
              <p className="donation-id">Campaign ID: {donation.campaignId}</p>
              <p className="donation-amount">Amount: {donation.amount} HBAR</p>
              <Link to={`/campaign-details/${donation.campaignId}`} className="view-campaign-link">
                View Campaign
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderInrDonations = () => {
    if (loadingInr) {
      return (
        <div className="spinner-container">
          <img src={Spinner} alt="Loading..." className="spinner" />
        </div>
      );
    }

    if (inrDonations.length === 0) {
      return <p className="no-donations">No INR donations found.</p>;
    }

    return (
      <div className="donations-grid">
        {inrDonations.map((donation, index) => (
          <div key={index} className="donation-card">
            <div className="donation-details">
              <p className="donation-amount">₹{donation.amount}</p>
              <p className="donation-date">
                {new Date(donation.createdAt).toLocaleDateString()}
              </p>
              <p className={`donation-status status-${donation.status.toLowerCase()}`}>
                {donation.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-donations-container">
      <h2 className="my-donations-heading">My Donations</h2>
      
      <div className="donations-section">
        <h3 className="section-heading">INR Donations</h3>
        {renderInrDonations()}
      </div>

      <div className="donations-section">
        <h3 className="section-heading">Crypto Donations (HBAR)</h3>
        {renderCryptoDonations()}
      </div>

      {/* <ToastContainer /> */}
    </div>
  );
};

export default MyDonations;
