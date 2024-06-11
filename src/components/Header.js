import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="header-logo">EduConsult</Link>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/allotments">Allotments</Link>
        <Link to="/last-ranks">Last Ranks</Link>
        <Link to="/fees">Fees</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/institutes">Institutes</Link>
        <Link to="/announcements">Announcements</Link>
      </nav>
      <Link to="/login" className="header-login">Login</Link>
    </header>
  );
};

export default Header;
