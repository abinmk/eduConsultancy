import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
      </div>
      <div className="profile-packages">
        <h3>Subscribed Packages</h3>
        {/* List subscribed packages here */}
      </div>
    </div>
  );
};

export default UserProfile;
