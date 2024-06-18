// src/components/Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../styles/Header.css';
import { FaUser, FaTachometerAlt, FaClipboardList, FaDollarSign, FaUniversity, FaBook, FaHeart } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="header-container">
      <Link to="/" className="logo">
        <img src="/images/logo.png" alt="Rank & Seats" />
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link to="/allotments">
              <FaClipboardList /> Allotments
            </Link>
            <Link to="/last-ranks">
              <FaClipboardList /> Last Ranks
            </Link>
            <Link to="/fees">
              <FaDollarSign /> Fees
            </Link>
            <Link to="/colleges">
              <FaUniversity /> Colleges
            </Link>
            <Link to="/courses">
              <FaBook /> Courses
            </Link>
            <Link to="/wishlist">
              <FaHeart /> Wishlist
            </Link>
            <Link to="/profile" className="profile-link">
              <FaUser />
            </Link>
            <button onClick={logout} className="logout-button">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
