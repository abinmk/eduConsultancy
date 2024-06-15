import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/UserProfile.module.css';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user profile');
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.profileContainer}>
      <h1>User Profile</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.profileDetails}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
        <h2>Subscribed Packages</h2>
        {user.packages && user.packages.length > 0 ? (
          <ul>
            {user.packages.map((pkg, index) => (
              <li key={index}>{pkg}</li>
            ))}
          </ul>
        ) : (
          <p>No subscribed packages</p>
        )}
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
    </div>
  );
};

export default UserProfile;
