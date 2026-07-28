import React from 'react';
import styled from 'styled-components';
import { FadeAnimated } from '../Form';

interface CardProps {
  width?: string;
  padding?: string;
  animationDuration?: number;
  background?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  width,
  padding,
  animationDuration,
  background,
}) => (
  <StyledCard
    width={width}
    padding={padding}
    animationDuration={animationDuration}
    background={background}
  >
    {children}
  </StyledCard>
);

Card.defaultProps = {
  animationDuration: 0,
};

const StyledCard = styled(FadeAnimated)<{
  width?: string;
  padding?: string;
  background?: string;
  animationDuration: number;
}>`
  animation: fadeIn ${({ animationDuration }) => animationDuration}s;
  position: relative;
  min-width: 300px;
  width: ${({ width }) => (width ? width : 'auto')};
  background: ${({ background }) => background || '#ffffff'};
  box-shadow: 0 8px 25px rgb(0 0 0 / 7%);
  border-radius: 24px;
  padding: ${({ padding }) => padding || '30px 25px'};
  z-index: 1;
  overflow: hidden;
  margin: 0px auto;

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

export default Card;
