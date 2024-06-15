import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateName = (name) => /^[a-zA-Z\s]{3,}$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobileNumber = (mobileNumber) => /^\d{10}$/.test(mobileNumber);

  useEffect(() => {
    const timeoutIds = [];

    Object.keys(validationErrors).forEach((key) => {
      if (validationErrors[key]) {
        const id = setTimeout(() => {
          setValidationErrors((prev) => ({ ...prev, [key]: '' }));
        }, 3000);
        timeoutIds.push(id);
      }
    });

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [validationErrors]);

  const handleRegister = async () => {
    const errors = {};
    if (!validateName(name)) {
      errors.name = 'Name can only contain alphabets and spaces and must be at least 3 characters';
    }
    if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }
    if (!validateMobileNumber(mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        mobileNumber: '+91' + mobileNumber
      });
      setIsOtpSent(true);
      setMessage('OTP sent successfully. Please check your mobile.');
      setError('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to register user. Please try again.');
      }
      setMessage('');
      console.error(error);
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
      navigate('/'); // Redirect to home page
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
      setMessage('');
      console.error(error);
    }
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      setValidationErrors((prev) => ({ ...prev, mobileNumber: '' }));
    } else {
      setValidationErrors((prev) => ({ ...prev, mobileNumber: 'Mobile number must be exactly 10 digits and contain only numbers' }));
    }
  };

  const handleMobileNumberBlur = () => {
    if (!validateMobileNumber(mobileNumber)) {
      setValidationErrors((prev) => ({ ...prev, mobileNumber: 'Mobile number must be exactly 10 digits' }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setValidationErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
    } else {
      setValidationErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
      setValidationErrors((prev) => ({ ...prev, name: '' }));
    } else {
      setValidationErrors((prev) => ({ ...prev, name: 'Name can only contain alphabets and spaces and must be at least 3 characters' }));
    }
  };

  const isRegisterButtonDisabled = !validateName(name) || !validateEmail(email) || !validateMobileNumber(mobileNumber);

  return (
    <div className={styles.registerContainer}>
      <div className={styles.logoContainer}>
        <img src="/images/logo.png" alt="Logo" className={styles.logo} />
      </div>
      <h1>Register</h1>
      <form className={styles.registerForm} onSubmit={(e) => e.preventDefault()}>
        {!isOtpSent ? (
          <>
            <label>
              Name:
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
                className={styles.input}
              />
              {validationErrors.name && <p className={styles.error}>{validationErrors.name}</p>}
            </label>
            <label>
              Email:
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className={styles.input}
              />
              {validationErrors.email && <p className={styles.error}>{validationErrors.email}</p>}
            </label>
            <label>
              Mobile Number:
              <div className={styles.mobileInputContainer}>
                <span className={styles.countryCode}>+91</span>
                <input
                  type="text"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  onBlur={handleMobileNumberBlur}
                  className={styles.mobileInput}
                  maxLength="10"
                />
              </div>
              {validationErrors.mobileNumber && <p className={styles.error}>{validationErrors.mobileNumber}</p>}
            </label>
            <button type="button" onClick={handleRegister} disabled={isRegisterButtonDisabled}>Register</button>
          </>
        ) : (
          <>
            <label>
              OTP:
              <input
                type="text"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.input}
              />
            </label>
            <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
