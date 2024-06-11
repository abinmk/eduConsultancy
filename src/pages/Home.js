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
      <section className="educational-content">
        <h2>Our Services</h2>
        <p>We offer a wide range of educational services to help students achieve their academic goals, including personalized counseling, college application assistance, and more.</p>
        <h2>Testimonials</h2>
        <p>"Thanks to the guidance and support from this consultancy, I was able to get into my dream college!" - Student A</p>
        <p>"The consultants are very knowledgeable and helped me every step of the way." - Student B</p>
      </section>
    </Layout>
  );
};

export default Home;
