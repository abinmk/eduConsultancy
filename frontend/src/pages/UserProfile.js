// src/pages/Profile.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Function to fetch the user profile
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {userProfile.name}</p>
      <p>Email: {userProfile.email}</p>
      <p>Mobile Number: {userProfile.mobileNumber}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default Profile;
