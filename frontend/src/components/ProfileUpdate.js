import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ProfileUpdate.module.css';

const ProfileUpdate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Load user profile data when component mounts
    const loadProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/profile');
        const { name, email, state } = response.data;
        setName(name);
        setEmail(email);
        setState(state);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };
    loadProfile();
  }, []);

  const validateName = (name) => /^[a-zA-Z\s]{3,}$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleProfileUpdate = async () => {
    const errors = {};
    if (!validateName(name)) {
      errors.name = 'Name can only contain alphabets and spaces and must be at least 3 characters';
    }
    if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.put('http://localhost:5001/api/auth/profile', {
        name,
        email,
        state
      });
      setMessage('Profile updated successfully.');
      setError('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
      setMessage('');
      console.error(error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h1>Profile Update</h1>
      <form className={styles.profileForm} onSubmit={(e) => e.preventDefault()}>
        <label>
          Name:
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setValidationErrors((prev) => ({ ...prev, name: '' }));
            }}
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
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={styles.input}
          />
          {validationErrors.email && <p className={styles.error}>{validationErrors.email}</p>}
        </label>
        <label>
          State:
          <input
            type="text"
            placeholder="Enter your state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={styles.input}
          />
        </label>
        <button type="button" onClick={handleProfileUpdate}>Save</button>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default ProfileUpdate;
