import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5001/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('User data:', response.data);  // Debugging log
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="header-logo" onClick={closeMenu}>
        <img src="/images/logo.png" alt="Rank & Seats Logo" className="logo-image" />
      </Link>
      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/allotments" onClick={closeMenu}>Allotments</Link>
        <Link to="/last-ranks" onClick={closeMenu}>Last Ranks</Link>
        <Link to="/fees" onClick={closeMenu}>Fees</Link>
        <Link to="/courses" onClick={closeMenu}>Courses</Link>
        <Link to="/institutes" onClick={closeMenu}>Institutes</Link>
        <Link to="/announcements" onClick={closeMenu}>Announcements</Link>
      </nav>
      <div className="header-right">
        {user ? (
          <>
            <Link to="/user-profile" className="header-profile" onClick={closeMenu}>
              <img src="/images/user-profile-icon.png" alt="User Profile" className="user-icon" />
              <span className="profile-text">{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="header-logout">Logout</button>
          </>
        ) : (
          <Link to="/login" className="header-login" onClick={closeMenu}>Login</Link>
        )}
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default Header;
