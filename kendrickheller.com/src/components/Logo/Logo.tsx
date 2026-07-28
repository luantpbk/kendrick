import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import useLogo from 'src/hooks/useLogo';

const Logo: React.FC = () => {
  const logo = useLogo();
  return (
    <StyledLogo to="/">
      <img src={logo} height="48" />
    </StyledLogo>
  );
};

const StyledLogo = styled(NavLink)`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    img {
      height: 46px;
    }
  }
`;

export default Logo;
