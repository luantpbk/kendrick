import React from 'react';
import styled from 'styled-components';

interface CardContentProps {
  children?: React.ReactElement
}

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <StyledCardContent>{children}</StyledCardContent>
);

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export default CardContent;
