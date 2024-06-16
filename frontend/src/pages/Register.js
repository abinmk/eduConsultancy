// src/pages/Register.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from '../styles/Register.module.css';

const Register = () => {
  const { state } = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber] = useState(state.mobileNumber);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCounselling, setSelectedCounselling] = useState(null);
  const navigate = useNavigate();

  const states = [
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    // Add all other states
  ];

  const counsellingOptions = [
    { label: 'NEET PG', value: 'NEET PG' },
    { label: 'NEET UG', value: 'NEET UG' },
    { label: 'INI CET', value: 'INI CET' },
    { label: 'NEET SS', value: 'NEET SS' }
  ];

  const handleSendOtp = async () => {
    if (mobileNumber.length === 10) {
      try {
        await axios.post('http://localhost:5001/api/auth/send-otp-register', {
          mobileNumber: '+91' + mobileNumber
        });
        setIsOtpSent(true);
        setError('');
      } catch (error) {
        setError('Failed to send OTP. Please try again.');
      }
    } else {
      setError('Please enter a valid 10-digit mobile number');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/verify-otp-register', {
        name,
        email,
        mobileNumber: '+91' + mobileNumber,
        state: selectedState,
        counselling: selectedCounselling,
        code: otp
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to verify OTP or register. Please try again.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <img src="/images/logo.png" alt="Logo" className={styles.logo} />
      <div className={styles.registerBox}>
        <h1>Register</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Dropdown
            value={selectedState}
            options={states}
            onChange={(e) => setSelectedState(e.value)}
            placeholder="Select your state"
          />
          <Dropdown
            value={selectedCounselling}
            options={counsellingOptions}
            onChange={(e) => setSelectedCounselling(e.value)}
            placeholder="Preferred Counselling"
          />
          {isOtpSent ? (
            <>
              <InputText
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                placeholder="Enter OTP"
              />
              <Button label="Verify OTP & Register" onClick={handleVerifyOtp} />
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

export default Register;