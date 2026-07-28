import React from 'react';
import styled from 'styled-components';
import AccountButton, { StyledButton } from './components/AccountButton';
import logo from '../../assets/img/logo.png';
import useProfile from 'src/hooks/useProfile';
import { useRemoveProfileInfo } from 'src/state/application/hooks';
import { NavLink } from 'react-router-dom';

interface TopBarProps {
  home?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ home }) => {
  const profile = useProfile();
  const removeProfileInfo = useRemoveProfileInfo();
  return (
    <TopBarContainer marginBottom={home ? 46 : 0}>
      <StyledTopBar>
        <StyledTopBarInner>
          <StyledLogoContainer>
            <StyledLogo to="/">
              <img src={logo} height="48" />
            </StyledLogo>
          </StyledLogoContainer>
          <StyledButtonGroup>
            {/* {profile && <AccountButton fullName={profile?.info?.fullName} />} */}
            {profile && (
              <StyledButton to="/auth" onClick={removeProfileInfo}>
                Đăng xuất
                <i className="fas fa-sign-out-alt"></i>
              </StyledButton>
            )}
            {/* {!profile && <StyledButton to="/login">Đăng nhập</StyledButton>} */}
          </StyledButtonGroup>
        </StyledTopBarInner>
      </StyledTopBar>
    </TopBarContainer>
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

const TopBarContainer = styled.div<{ marginBottom: number }>`
  margin-bottom: ${(p) => p.marginBottom}px;
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const StyledLogoContainer = styled.div``;

const StyledTopBar = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  z-index: 3;
  position: relative;
`;

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${(props) => props.theme.topBarSize}px;
  width: 100%;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const StyledButtonGroup = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 15px;
  margin-left: auto;
  @media (max-width: 768px) {
    margin-left: auto;
  }
`;

export default TopBar;
