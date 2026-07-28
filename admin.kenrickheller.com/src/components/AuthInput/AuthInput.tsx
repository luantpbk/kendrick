import {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from 'react';
import React from 'react';
import './AuthInput.css';
import styled from 'styled-components';

interface IAuthInput<T> {
  leftIcon?: string;
  leftAction?: () => void;
  rightIcon?: string;
  rightAction?: () => void;
  value: T;
  isDisabled?: boolean;
  placeholder: string;
  errorMessage?: string;
  type?: HTMLInputTypeAttribute | undefined;
  onChange?: (value: T) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onBlur?: () => void;
}

const AuthInput = <T extends string | number | readonly string[]>(props: IAuthInput<T>) => {
  const {
    leftIcon,
    leftAction,
    rightIcon,
    rightAction,
    value,
    isDisabled,
    placeholder,
    errorMessage,
    type,
    onChange,
    onKeyDown,
    onBlur,
  } = props;
  const first = useRef(true);

  useEffect(() => {
    if (!first.current && onBlur) onBlur();
    first.current = false;
  }, [onBlur, value]);

  return (
    <>
      <div className={`login-input ${errorMessage ? 'error' : ''}`}>
        <i className={leftIcon} onClick={leftAction} />
        <input
          type={type}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value as T)}
          onKeyDown={onKeyDown}
        />
        {!isDisabled && value ? (
          <i className="fas fa-times" onClick={() => onChange(undefined)}></i>
        ) : null}
        <i className={rightIcon} onClick={rightAction} />
      </div>
      <div className="login-form-error-text">{errorMessage}</div>
    </>
  );
};

export default AuthInput;
