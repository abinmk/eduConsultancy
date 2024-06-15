import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';
import '../styles/global.css'; // Import the global styles

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-top: 0; /* Ensure no padding on top */
`;

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      <main>{children}</main>
      <Footer />
    </Container>
  );
};

export default Layout;
