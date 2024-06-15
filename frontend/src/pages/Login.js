import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure this points to your axios instance if you have one
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (mobileNumber.length === 10) {
      try {
        const response = await axios.post('http://localhost:5001/api/auth/send-otp', {
          mobileNumber: '+91' + mobileNumber
        });
        setIsOtpSent(true);
        setMessage('OTP sent successfully. Please check your mobile.');
        setError('');
        setCountdown(30);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
        setMessage('');
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
      localStorage.setItem('token', response.data.token); // Store the JWT token
      setMessage('OTP verified successfully. Redirecting to home...');
      setError('');
      setTimeout(() => {
        navigate('/'); // Redirect to home page after 2 seconds
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
      setMessage('');
    }
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      setError('');
    } else {
      setError('Please enter only numeric values up to 10 digits');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <img 
            src="/images/logo.png" 
            alt="Rank & Seats Logo" 
            className={styles.logo}
          />
        </div>
        <h1>Login</h1>
        <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.mobileInputContainer}>
            <span className={styles.countryCode}>+91</span>
            <input
              type="text"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              className={styles.mobileInput}
              maxLength="10"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.message}>{message}</p>}
          {isOtpSent && (
            <>
              <label>
                OTP:
                <input
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.otpInput}
                />
              </label>
              <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
              <button type="button" onClick={handleSendOtp} disabled={countdown > 0}>
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </>
          )}
          {!isOtpSent && (
            <button type="button" onClick={handleSendOtp}>Send OTP</button>
          )}
        </form>
        <p className={styles.registerText}>Don't have an account?</p>
        <Link to="/register" className={styles.registerLink}>Create one</Link>
      </div>
    </div>
  );
};

export default Login;
