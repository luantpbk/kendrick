import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const AccountButton: React.FC<{ fullName: string }> = ({ fullName }) => {
  return <StyledButton to="/profile">{fullName}</StyledButton>;
};

export const StyledButton = styled(NavLink)`
  align-items: center;
  background: rgba(228, 228, 228, 0.3);
  border: 0;
  border-radius: 8px;
  color: ${(props) => props.theme.color.primary};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  text-decoration: none;
  justify-content: center;
  outline: none;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  width: 100%;
  i {
    margin-left: 10px;
    font-size: 20px;
  }
  &:disabled {
    pointer-events: none;
    color: ${(props) => `${props.theme.color.primary}`};
  }
  &:hover {
    color: ${(props) => props.theme.color.secondary};
  }
  @media (max-width: 1070px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`;

export default AccountButton;
