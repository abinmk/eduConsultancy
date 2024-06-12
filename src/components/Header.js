import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="header-logo" onClick={closeMenu}>
        <img src="/images/logo.png" alt="Rank & Seats" className="logo-image" />
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
      <Link to="/login" className="header-login" onClick={closeMenu}>Login</Link>
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default Header;
