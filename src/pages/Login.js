import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      setIsOtpSent(true);
      setError('');
    } else {
      setError('Please enter a valid 10-digit mobile number');
    }
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic here
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
          {isOtpSent && (
            <label>
              OTP:
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.otpInput}
              />
            </label>
          )}
          {!isOtpSent ? (
            <button type="button" onClick={handleSendOtp}>Send OTP</button>
          ) : (
            <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
          )}
        </form>
        <p className={styles.registerText}>Don't have an account?</p>
        <Link to="/register" className={styles.registerLink}>Create one</Link>
      </div>
    </div>
  );
};

export default Login;
