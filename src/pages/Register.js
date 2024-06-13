import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = () => {
    // Implement OTP sending logic here
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic here
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.logoContainer} onClick={() => navigate('/')}>
        <img 
          src="/images/logo.png" 
          alt="Rank & Seats Logo" 
          className={styles.logo}
        />
      </div>
      <h1>Register</h1>
      <form className={styles.registerForm}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </label>
        {isOtpSent && (
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </label>
        )}
        {!isOtpSent ? (
          <button type="button" onClick={handleSendOtp}>Send OTP</button>
        ) : (
          <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
        )}
      </form>
    </div>
  );
};

export default Register;
