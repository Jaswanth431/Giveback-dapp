import { Link, useNavigate } from 'react-router-dom';
import useWallet from '../usewallet';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, resetUser, setWalletConnected, resetWallet } from '../store';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { connectWallet, address } = useWallet();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isWalletConnected } = useSelector((state) => state);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (address) {
      dispatch(setWalletConnected(true));
    } else {
      dispatch(setWalletConnected(false));
    }
  }, [address, dispatch]);

  const handleLogout = () => {
    dispatch(resetUser());
    dispatch(resetWallet());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const renderNavLinks = () => {
    console.log(user);
    if (!user) {
      return (
        <>
          <Link className='nav-link' to="/register">Sign Up</Link>
          <Link className='nav-link' to="/ngo-register">NGO Sign Up</Link>
          <Link className='nav-link btn-special' to="/login">Login</Link>
        </>
      );
    }

    switch (user.role) {
      case 'DONATOR':
        return (
          <>
            <Link className='nav-link' to="/">Home</Link>
            <Link className='nav-link' to="/my-campaigns">My Campaigns</Link>
            <Link className='nav-link' to="/my-donations">My Donations</Link>
            <Link className='nav-link-button btn-special' to="/donate">Donate to Platform</Link>
            {isWalletConnected ? (
              <Link className='nav-link-button btn-special' to="/create-campaign">Create Campaign</Link>
            ) : (
              <button className='nav-link-button btn-special' onClick={connectWallet}>Connect Wallet</button>
            )}
            <button className='nav-link-button btn-special' onClick={handleLogout}>Logout</button>
          </>
        );
      case 'NGO':
        return (
          <>
            <Link className='nav-link' to="/request-funds">Request Funds</Link>
            <Link className='nav-link' to="/fund-requests-history">History</Link>
            <button className='nav-link-button btn-special' onClick={handleLogout}>Logout</button>
          </>
        );
      case 'ADMIN':
        return (
          <>
            <Link className='nav-link' to="/admin">Dashboard</Link>
            <Link className='nav-link' to="/admin/pending-fund-requests">Pending Requests</Link>
            <Link className='nav-link' to="/admin/request-history">Request History</Link>
            <button className='nav-link-button btn-special' onClick={handleLogout}>Logout</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <div className='logo'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#d80032" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 11.25 8.689v8.122Z" />
          </svg>
        </div>
        <div className='logo-text'>GiveBack</div>
      </div>
      <div className="navbar-right">
        {renderNavLinks()}
      </div>
    </div>
  );
};

export default Navbar;
