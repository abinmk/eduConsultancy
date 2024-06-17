import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (mobileNumber.length === 10) {
      try {
        const response = await axiosInstance.post('/auth/send-otp', {
          mobileNumber: '+91' + mobileNumber
        });
        setIsOtpSent(true);
        setError('');
        setTimer(30);
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
      const response = await axiosInstance.post('/auth/verify-otp', {
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

  const handleChangeNumber = () => {
    setIsOtpSent(false);
    setOtp('');
    setTimer(0);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backgroundPattern}>
        <div className={`${styles.circle} ${styles.circle1}`}></div>
        <div className={`${styles.circle} ${styles.circle2}`}></div>
        <div className={`${styles.circle} ${styles.circle3}`}></div>
        <div className={`${styles.circle} ${styles.circle4}`}></div>
        <div className={`${styles.triangle} ${styles.triangle1}`}></div>
        <div className={`${styles.triangle} ${styles.triangle2}`}></div>
        <div className={`${styles.line} ${styles.line1}`}></div>
        <div className={`${styles.line} ${styles.line2}`}></div>
      </div>
      <div className={styles.loginBox}>
        <Link to="/" className={styles.logoContainer}>
          <img src="/images/logo.png" alt="Logo" className={styles.logo} />
        </Link>
        <h1>Sign In</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.mobileInputContainer}>
            <span className={styles.inputAddon}>+91</span>
            <InputText
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              maxLength="10"
              placeholder="Enter your mobile number"
              className={styles.inputText}
              type="tel"
            />
          </div>
          {isOtpSent ? (
            <>
              <InputText
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength="6"
                placeholder="Enter OTP"
                className={styles.inputText}
                type="tel"
              />
              <Button label="Verify OTP" className={styles.button} onClick={handleVerifyOtp} />
              <Button label="Change Number" className={styles.button} onClick={handleChangeNumber} />
              {timer > 0 ? (
                <p className={styles.timerMessage}>Resend OTP in {timer} seconds</p>
              ) : (
                <Button label="Resend OTP" className={styles.button} onClick={handleSendOtp} />
              )}
            </>
          ) : (
            <Button label="Send OTP" className={styles.button} onClick={handleSendOtp} />
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
