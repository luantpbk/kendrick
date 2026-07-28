import { useEffect, useState } from 'react';
import React from 'react';
import './InputComponent.css';
import styled from 'styled-components';

interface IInputComponent {
  className?: string; //add className
  isDisable: boolean;
  value: string | number; //
  placeholder?: string;
  align?: string; //right, center, null
  rightIcon?: string;
  rightAction?: () => void;
  onChange?: (...args: any[]) => any;
  name: string;
  width: string;
  height: string;
  inputType: string; //input, text-area
  cols?: number;
  rows?: number;
  onKeyDown?: (...args: any[]) => any;
}

const InputComponent: React.FC<IInputComponent> = (props) => {
  const [value, setValue] = useState<number | string>(undefined);

  useEffect(() => {
    setValue(props.value);
  }, [props]);

  const onChange = (
    event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>,
  ) => {
    const _value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    setValue(_value);
    props.onChange ? props.onChange(props.name, _value) : '';
  };

  const onKeyDown = (event) => {
    if (props.onKeyDown) {
      props.onKeyDown(event.keyCode);
    }
  };

  if (props.inputType === 'input') {
    return (
      <WrapperContainer width={props.width} height={props.height}>
        <input
          className={`${props.className} ${props.align} input-input-component`}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={props.placeholder}
          disabled={props.isDisable}
          onKeyDown={onKeyDown}
        />
        <ActionIcon className={props.rightIcon} onClick={props.rightAction} />
      </WrapperContainer>
    );
  } else if (props.inputType === 'text-area') {
    return (
      <WrapperContainer width={props.width} height={props.height}>
        <textarea
          className={`${props.className} ${props.align}  input-text-area-component`}
          cols={props.cols}
          rows={props.cols}
          value={value}
          onChange={onChange}
          placeholder={props.placeholder}
          disabled={props.isDisable}
          onKeyDown={onKeyDown}
        ></textarea>
        <ActionIcon className={props.rightIcon} onClick={props.rightAction} />
      </WrapperContainer>
    );
  }
};

export default InputComponent;

const WrapperContainer = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => width || 'fit-content'};
  height: ${({ height }) => height || 'fit-content'};
  display: flex;
  flex-directory: row;
`;

const ActionIcon = styled.i`
  margin: auto 10px;
`
