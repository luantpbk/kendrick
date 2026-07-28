import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

interface CheckboxProps {
  width?: string;
  title?: string;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  value: boolean;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    width,
    title,
    disabled,
    onChange,
    value,
  } = props;

  return (
    <StyledWrapperCheckbox width={width}>
      <StyledCheckbox 
        type="checkbox" 

        disabled={disabled} 
        checked={value || false} 
        onChange={() => onChange(!value)}
      /> 
      {title? <label>{title}</label> : null}
    </StyledWrapperCheckbox>
  );
};


export default Checkbox;

const StyledWrapperCheckbox = styled.div<{ width: string}>`
  width: ${({ width }) => width || 'fit-content'};
`
const StyledCheckbox = styled.input`
  margin: 0 4px;
`