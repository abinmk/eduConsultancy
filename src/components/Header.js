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

  return (
    <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="header-logo">EduConsult</Link>
      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/allotments" onClick={toggleMenu}>Allotments</Link>
        <Link to="/last-ranks" onClick={toggleMenu}>Last Ranks</Link>
        <Link to="/fees" onClick={toggleMenu}>Fees</Link>
        <Link to="/courses" onClick={toggleMenu}>Courses</Link>
        <Link to="/institutes" onClick={toggleMenu}>Institutes</Link>
        <Link to="/announcements" onClick={toggleMenu}>Announcements</Link>
        <Link to="/login" className="header-login" onClick={toggleMenu}>Login</Link>
      </nav>
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default Header;
