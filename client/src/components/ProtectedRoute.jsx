import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  console.log(allowedRoles)
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  console.log(allowedRoles, user, token);
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 