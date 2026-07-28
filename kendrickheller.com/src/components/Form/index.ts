import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const FadeAnimated = styled.div`
  animation: fadeIn 0.3s;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Internet Explorer */
  @-ms-keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Form = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - ${(props) => props.theme.topBarSize * 2}px);
  padding-top: ${(props) => props.theme.spacing[5]}px;
  padding-bottom: ${(props) => props.theme.spacing[3]}px;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FormHeaderContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const FormHeaderContainera = styled.div`
  display: flex;
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const FormAction = styled.div`
  margin-left: auto;
`;

export const ButtonRefreshUnclaimedContent = styled.div`
  margin: 0 4px;
`;

export const FormTitle = styled.h4`
  color: ${(props) => props.theme.color.white};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
`;

export const FormSeparator = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FormToken = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 16px;
  font-weight: 600;
  width: 120px;
  color: ${(props) => props.theme.color.white};
  margin-left: 5px;
  span {
    margin-left: 10px;
  }
`;

export const FormButtonsContainer = styled.div`
  margin-top: 30px;
`;

export const StyledCardTitle = styled.div`
  font-size: 24px;
  margin: 0px 0px 30px 0px;
  font-weight: 600;
`;

export const StyledButton = styled.button<{ isFull?: boolean }>`
  flex: ${({ isFull }) => (isFull ? '1' : 'none')};
  width: ${({ isFull }) => (isFull ? '100%' : 'fit-content')};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto 10px auto;
  color: #ffffff;
  background: #355dff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 22px;
  cursor: pointer;
  transition: all 100ms ease-in-out 0s;
  :hover {
    background: #1140ff;
  }
`;

export const StyledButtonLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  color: #355dff;
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 100ms ease-in-out 0s;
  text-decoration: none;
  text-align: center;
  width: max-content;
  padding: 2px 4px;
  :hover {
    text-decoration: underline;
  }
`;

export const StyledCardFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  font-size: 14px;
`;
