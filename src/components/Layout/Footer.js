import React from 'react';
import styled from 'styled-components';
import Wrapper from '@common/Wrapper';

import logo from '@src/static/logo_white.svg';

const FooterWrapper = styled.footer`
  width: 100vw;
  padding: 10px;
  background: ${p =>
    p.theme.dark ? p.theme.secondaryColor : p.theme.gradient};

  p {
    font-size: 1rem;
    line-height: 35px;
    color: white;
  }

  a {
    color: ${p =>
      p.theme.dark ? p.theme.primaryColor : p.theme.secondaryColor};
    &:hover {
      color: ${p => p.theme.primaryText};
    }
  }
`;

const Footer = () => (
  <FooterWrapper>
    <Wrapper>
      <img width="35px" src={logo} alt="anurag hazra" />
      <p>
        <b>Chen Huang</b> &copy; {new Date().getFullYear()}
    </p>
      <p style={{ float: 'right' }}>
        Designed by
        <a href="https://github.com/anuraghazra" target="__blank">
          &nbsp;anuraghazra
        </a>
      </p>
    </Wrapper>
  </FooterWrapper>
);

export default Footer;
