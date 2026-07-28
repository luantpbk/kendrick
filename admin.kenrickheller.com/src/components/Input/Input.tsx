import React, { HTMLInputTypeAttribute, useRef, useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

interface InputProps<T> {
  width?: string;
  title?: string;
  require?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  onChange?: (value: T) => void;
  value?: T;
  type?: HTMLInputTypeAttribute;
  inputPadding?: string;
  onBlur?: (...args: any[]) => any;
  error?: string;
  rightIcon?: string;
  rightAction?: () => void;
  focus?: boolean;
  row?: number;
}

const Input = <T extends string | ReadonlyArray<string> | number | undefined>(
  props: InputProps<T>,
) => {
  const {
    width,
    title,
    require,
    hasError,
    disabled,
    placeholder,
    onChange,
    value,
    type,
    inputPadding,
    onBlur,
    error,
    rightIcon,
    rightAction,
    focus,
    row
  } = props;

  const scanInput = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (focus) scanInput.current?.focus();
  }, [props]);

  return (
    <StyledInputWrapper width={width}>
      {(value || !placeholder) && title ? (
        <StyledTitle>
          {title}
          {require ? <RequireSpan>*</RequireSpan> : null}
        </StyledTitle>
      ) : null}
      <StyledInput
        hasError={hasError}
        disabled={disabled}
        placeholder={placeholder}
        width={width}
        spellCheck={false}
        onChange={(event) => onChange((event.target as HTMLTextAreaElement).value as T)}
        padding={inputPadding}
        value={value || ''}
        type={type}
        onBlur={onBlur}
        ref={scanInput}
        rows={row > 0? row : 1}
        
      ></StyledInput>
      {error ? <div style={{ color: 'red', paddingLeft: 2 }}>{error}</div> : null}
      {rightIcon ? (
        <StyledIcon className="material-icons" onClick={rightAction}>
          {rightIcon}
        </StyledIcon>
      ) : null}
    </StyledInputWrapper>
  );
};

const RequireSpan = styled.span`
  color: red;
  margin-left: 2px;
`;

const StyledInputWrapper = styled.fieldset<{ width?: string }>`
  border: 1px solid #dddcdc;
  flex: 1;
  width: ${({ width }) => (width ? width : 'fit-content')};
  padding: 0 10px 0px 10px;
  border-radius: 5px;
`;

const StyledTitle = styled.legend`
  font-size: medium;
  margin-bottom: -5px;
  padding: 0 5px 3px 5px;
  width: fit-content;
`;

const StyledIcon = styled.i`
  font-size: 20px;
  position: absolute;
  right: 15px;
  top: 26px;
  cursor: pointer;
`;
const StyledInput = styled.textarea <{
  width?: string;
  hasError?: boolean;
  padding?: string;
  type: string;
}>`
  color: ${({ theme, hasError }) => (hasError ? theme.color.danger : theme.color.primary)};
  text-align: ${({ type }) => (type == 'number' ? 'right' : 'left')};
  outline: none;
  border: none;
  resize: none;
  width: 100%;
  /* min-width: ${({ width }) => (width ? `calc(${width} - 20px)` : '240px')}; */
  max-width: 80vw;
  background-color: transparent;
  font-size: medium;
  // white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ padding }) => (padding ? padding : '3px')};
  appearance: textfield;
  font-weight: 400;
  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #dddcdc;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: #dddcdc;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: #dddcdc;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: #dddcdc;
  }
`;

export default Input;
