import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #ddd;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Educational Consultancy. All rights reserved.</p>
      <p>
        <a href="/terms">Terms & Conditions</a> | <a href="/privacy">Privacy Policy</a> | <a href="/contact">Contact Us</a>
      </p>
    </FooterContainer>
  );
};

export default Footer;
