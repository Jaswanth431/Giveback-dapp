import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CampaignDetails from "./components/CampaignDetails";
import CreateCampaign from "./components/CreateCampaign";
import MyCampaigns from "./components/MyCampaigns";
import MyDonations from "./components/MyDonations";
import Footer from "./components/Footer";
import UserLogin from "./components/auth/UserLogin";
import UserRegister from "./components/auth/UserRegister";
import NGORegister from "./components/auth/NGORegister";
import DonationForm from "./components/DonationForm";
import NGORequestFund from "./components/NGORequestFund";
import FundRequestHistory from "./components/FundRequestHistory";
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import PendingFundRequests from './components/admin/PendingFundRequests';
import RequestHistory from './components/admin/RequestHistory';
import PlatformStats from './components/admin/PlatformStats';

function App() {
  const { user } = useSelector((state) => state);

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={
            user?.role === 'NGO' ? (
              <Navigate to="/fund-requests-history" replace />
            ) : (
              <Home />
            )
          } />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/register" element={<UserRegister/>} />
          <Route path="/ngo-register" element={<NGORegister/>} />
          
          {/* Routes for NGOs */}
          <Route
            path="/my-campaigns"
            element={
              <ProtectedRoute allowedRoles={["DONATOR"]}>
                <MyCampaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-campaign"
            element={
              <ProtectedRoute allowedRoles={['DONATOR']}>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-funds"
            element={
              <ProtectedRoute allowedRoles={['NGO']}>
                <NGORequestFund />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fund-requests-history"
            element={
              <ProtectedRoute allowedRoles={['NGO']}>
                <FundRequestHistory />
              </ProtectedRoute>
            }
          />

          {/* Routes for Donors */}
          <Route
            path="/my-donations"
            element={
              <ProtectedRoute allowedRoles={['DONATOR']}>
                <MyDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute allowedRoles={['DONATOR']}>
                <DonationForm />
              </ProtectedRoute>
            }
          />

          {/* Public route for campaign details */}
          <Route path="/campaign-details/:id" element={<CampaignDetails/>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><PlatformStats /></ProtectedRoute>} />
          <Route path="/admin/pending-fund-requests" element={<ProtectedRoute allowedRoles={['ADMIN']}><PendingFundRequests /></ProtectedRoute>} />
          <Route path="/admin/request-history" element={<ProtectedRoute allowedRoles={['ADMIN']}><RequestHistory /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer/>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
