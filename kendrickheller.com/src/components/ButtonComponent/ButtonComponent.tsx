import React, { useState } from 'react';
import styled from 'styled-components';
import Loading from '../Loading';

interface IButtonComponent {
  className?: string;
  width?: string;
  color?: string;
  height?: string;
  background?: string;
  colorhover?: string;
  backgroundHover?: string;
  onClick?: (...args: any[]) => any | Promise<any>;
  loader?: boolean;
  title?: string;
  icon?: string;
  callback?: (data) => void;
}

const ButtonComponent: React.FC<IButtonComponent> = (props) => {
  const { className, width, height, background, backgroundHover, color, colorhover, title, icon, onClick, loader, callback } = props;

  const [isLoading, setLoading] = useState(false);

  const click = () => {
    if (isLoading) return;
    if (onClick) {
      if (loader) {
        setLoading(true);
        onClick().then((res) => {
          setLoading(false);
          if (callback) callback(res);
        }).catch(() => {
          setLoading(false);
        });
      } else {
        onClick();
      }
    }
  }
  return (
    <StyledButton
      width={width}
      height={height}
      background={background}
      backgroundHover={backgroundHover}
      colorhover={colorhover}
      color={color}
      onClick={click}
      className={className ?? ""}
    >
      {isLoading ? <Loading /> : icon ? <StyledIcon className="material-icons">{icon}</StyledIcon> : null}
      <StyledLabel>{title}</StyledLabel>
    </StyledButton>
  );
};

export default ButtonComponent;

const StyledButton = styled.div<{ width?: string, height?: string, background?: string, color?: string, colorhover?: string, backgroundHover?: string }>`
  background-color: ${({ background }) => background ? background : 'rgb(17, 17, 17)'};
  color: ${({ color }) => color ? color : 'white'};
  padding: 10px;
  margin: 0 min(2vw, 30px);
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  &:hover {
    background-color: ${({ background, backgroundHover }) => backgroundHover ? backgroundHover : background ? background : 'rgb(17, 17, 17)'};
    color: ${({ colorhover, color }) => colorhover ? colorhover : color ? color : 'white'};
  }
`;

const StyledIcon = styled.span`
  vertical-align: middle;
  margin: auto 5px;
`

const StyledLabel = styled.label`
  vertical-align: middle;
  margin: auto 5px;
  padding-bottom: 2px;
  cursor: pointer;
`
