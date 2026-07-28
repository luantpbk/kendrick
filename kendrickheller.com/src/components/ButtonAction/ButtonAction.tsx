import React from 'react';
import { EventButton } from 'src/api/models';
import styled from 'styled-components';
import { v4 } from 'uuid';
import './ButtonAction.css';

interface IButtonAction {
  button: EventButton;
  width?: string;
  height?: string;
  isFile?: boolean;
  preProcess?: () => void
}

const ButtonAction: React.FC<IButtonAction> = (props) => {

  const inputFileId = props.isFile ? v4() : undefined;
  const onAction = () => {
    if(props.preProcess) props.preProcess();
    if(props.button.action) props.button.action();
  };
  return (
    <button
      style={{
        width: props.width??'fit-content',
        height: props.height??'fit-content',
        alignItems: props.button.align,
      }}
      className={`action-button ${props.button.buttonClass}`}
      onClick={onAction}
    >
      {props.isFile ? <StyledInput id={inputFileId} type="file" onChange={onAction}/> : null} 
      <label className='button-action-label' htmlFor={inputFileId}>
        <span className="material-icons button-action-icon">{props.button.icon}</span>
        <span className='button-action-name'>{props.button.name}</span>
      </label>
    </button>
  );
};

export default ButtonAction;

const StyledInput = styled.input`
  display: none;
`;
