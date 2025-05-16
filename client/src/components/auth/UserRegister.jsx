import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import APP_CONSTANTS from '../../constants';

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${APP_CONSTANTS.backendURL}/api/users/user-register`, formData);
        
        // Show success toast
        toast.success('Registration successful! Redirecting to login...');
        
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 1000);
        
      } catch (error) {
        // Handle specific error messages from the backend
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="content">
      <div className="row">
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
          <h2 style={{ 
            fontSize: '2.4rem', 
            textAlign: 'center', 
            marginBottom: '3rem',
            color: '#d80032'
          }}>
            Create your account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={{ 
                  borderColor: errors.name ? '#d80032' : '#ced4da',
                  marginBottom: errors.name ? '0.5rem' : '2rem'
                }}
              />
              {errors.name && (
                <p style={{ 
                  color: '#d80032', 
                  fontSize: '1.4rem', 
                  marginBottom: '1rem' 
                }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                style={{ 
                  borderColor: errors.email ? '#d80032' : '#ced4da',
                  marginBottom: errors.email ? '0.5rem' : '2rem'
                }}
              />
              {errors.email && (
                <p style={{ 
                  color: '#d80032', 
                  fontSize: '1.4rem', 
                  marginBottom: '1rem' 
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ 
                  borderColor: errors.password ? '#d80032' : '#ced4da',
                  marginBottom: errors.password ? '0.5rem' : '2rem'
                }}
              />
              {errors.password && (
                <p style={{ 
                  color: '#d80032', 
                  fontSize: '1.4rem', 
                  marginBottom: '1rem' 
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div className="input-box">
              <button type="submit" className="btn-special">
                Register
              </button>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem',
              fontSize: '1.6rem'
            }}>
              <p>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#d80032',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister; 