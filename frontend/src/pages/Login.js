// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSendOtp = async () => {
    if (mobileNumber.length === 10) {
      try {
        const response = await axios.post('http://localhost:5001/api/auth/send-otp', {
          mobileNumber: '+91' + mobileNumber
        });
        setIsOtpSent(true);
        setError('');
      } catch (error) {
        if (error.response && error.response.data.message === 'User not registered') {
          navigate('/register', { state: { mobileNumber } });
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      }
    } else {
      setError('Please enter a valid 10-digit mobile number');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/verify-otp', {
        mobileNumber: '+91' + mobileNumber,
        code: otp
      });
      const { token, userExists, user } = response.data;
      localStorage.setItem('token', token);
      if (userExists) {
        setUser(user);
        navigate('/dashboard');
      } else {
        navigate('/register', { state: { mobileNumber } });
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src="/images/logo.png" alt="Logo" className={styles.logo} />
      <div className={styles.loginBox}>
        <h1>Sign In</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.mobileInputContainer}>
            <span className="p-inputtext-addon">+91</span>
            <InputText
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              maxLength="10"
              placeholder="Enter your mobile number"
            />
          </div>
          {isOtpSent ? (
            <>
              <InputText
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                placeholder="Enter OTP"
              />
              <Button label="Verify OTP" onClick={handleVerifyOtp} />
            </>
          ) : (
            <Button label="Send OTP" onClick={handleSendOtp} />
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
