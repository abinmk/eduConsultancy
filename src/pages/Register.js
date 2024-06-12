import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    // Logic to send OTP
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Logic to verify OTP and complete registration
  };

  return (
    <div className={styles.authContainer}>
      <h2>Register</h2>
      {!otpSent ? (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
            />
            <button onClick={handleSendOtp}>Send OTP</button>
          </div>
        </>
      ) : (
        <div className={styles.formGroup}>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
      <Link to="/login">Already have an account? Login</Link>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default Register;
