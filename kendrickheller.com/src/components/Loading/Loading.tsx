import React from 'react';
import styled from 'styled-components';

interface LoadingProps {
  height?: string;
  size?: string;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ height, size, color }) => {
  return (
    <StyledLoadingContainer height={height} size={size} color={color}>
      <i className="fas fa-spin fa-spinner"></i>
    </StyledLoadingContainer>
  );
};

const StyledLoadingContainer = styled.div<{ height?: string; size?: string; color?: string }>`
  height: ${({ height }) => height || 'auto'};
  color: ${({ color, theme }) => color || theme.color.white};
  i {
    font-size: ${({ size }) => size || '16px'};
  }
`;

export default Loading;
