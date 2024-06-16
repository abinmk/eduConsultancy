import React from 'react';
import '../styles/Home.css';
import Layout from '../components/Layout';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <Layout>
      <section className="hero-section">
        <h1>Welcome to Our Educational Consultancy</h1>
        <p>Providing comprehensive services to help you achieve your educational goals.</p>
        <Button label="Learn More" />
      </section>

      <section className="connectivity-section">
        <div className="connectivity-content">
          <h2>Connectivity Has Never Been This Easier</h2>
          <p>
            Rank and Seats will be your one stop platform for all the NEET PG All India Counselling related information.
            We help you take an informed decision to opt for the best seat by providing data and information in a
            well-structured manner.
          </p>
        </div>
        <div className="connectivity-image">
          <img src="/images/doctor-illustration.png" alt="Doctors" />
        </div>
      </section>

      <section className="icon-section">
        <Link to="/allotments" className="icon">
          <img src="/images/allotments-icon.png" alt="Allotments" />
          <p>Allotments</p>
        </Link>
        <Link to="/last-ranks" className="icon">
          <img src="/images/last-ranks-icon.png" alt="Last Ranks" />
          <p>Last Ranks</p>
        </Link>
        <Link to="/courses" className="icon">
          <img src="/images/courses-icon.png" alt="Courses" />
          <p>Courses</p>
        </Link>
        <Link to="/announcements" className="icon">
          <img src="/images/announcements-icon.png" alt="Announcements" />
          <p>Announcements</p>
        </Link>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>01</h3>
            <p>Simplified Counselling Data of Previous Years with numerous filter options for better analysis.</p>
          </div>
          <div className="feature-card">
            <h3>02</h3>
            <p>Last Ranks of each course in each round of counselling in structured manner.</p>
          </div>
          <div className="feature-card">
            <h3>03</h3>
            <p>All the necessary filters you need of counselling data for better decision making.</p>
          </div>
          <div className="feature-card">
            <h3>04</h3>
            <p>All the NEET PG Counselling related announcements and information.</p>
          </div>
          <div className="feature-card">
            <h3>05</h3>
            <p>Latest College and course wise Fees, Stipend, Bond, etc. Details.</p>
          </div>
          <div className="feature-card">
            <h3>06</h3>
            <p>Course wise seat details of each course in every college with permitted and Recognized seat info.</p>
          </div>
        </div>
      </section>

      <section className="subscribe-section">
        <div className="subscribe-content">
          <h2>Subscribe</h2>
          <p>Subscribe to unlock all the information so that you can easily analyze and take an informed decision.</p>
          <Button label="Subscribe" className="subscribe-button" />
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Rank & Seats. All Rights Reserved.</p>
      </footer>
    </Layout>
  );
};

export default Home;
