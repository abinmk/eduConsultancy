import React from 'react';
import '../styles/Home.css';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <section className="hero-section">
        <h1>Welcome to Our Educational Consultancy</h1>
        <p>Providing comprehensive services to help you achieve your educational goals.</p>
        <button>Learn More</button>
      </section>

      <section className="icon-section">
        <div className="icon">
          <img src="/images/allotments-icon.png" alt="Allotments" />
          <p>Allotments</p>
        </div>
        <div className="icon">
          <img src="/images/last-ranks-icon.png" alt="Last Ranks" />
          <p>Last Ranks</p>
        </div>
        <div className="icon">
          <img src="/images/privacy-policy-icon.png" alt="Privacy Policy" />
          <p>Privacy Policy</p>
        </div>
        <div className="icon">
          <img src="/images/announcements-icon.png" alt="Announcements" />
          <p>Announcements</p>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>01</h3>
            <p>Simplified Counselling Data of Previous Years with numerous filter options for better analysis</p>
          </div>
          <div className="feature-card">
            <h3>02</h3>
            <p>Last Ranks of each course in each round of counselling in structured manner</p>
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
            <p>Latest College and course wise Fees, Stipend, Bond, etc. Details</p>
          </div>
          <div className="feature-card">
            <h3>06</h3>
            <p>Course wise seat details of each course in every college with permitted and Recognized seat info.</p>
          </div>
        </div>
      </section>

      <section className="educational-content">
        <h2>Our Services</h2>
        <p>We offer a wide range of educational services to help students achieve their academic goals, including personalized counseling, college application assistance, and more.</p>
        <h2>Testimonials</h2>
        <p>"Thanks to the guidance and support from this consultancy, I was able to get into my dream college!" - Student A</p>
        <p>"The consultants are very knowledgeable and helped me every step of the way." - Student B</p>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <p>Email: contact@educonsultancy.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Main St, Anytown, USA</p>
      </section>
    </Layout>
  );
};

export default Home;
