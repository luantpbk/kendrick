import { useState } from 'react';
import styled from 'styled-components';

interface ISelectBox<T> {
  width?: string;
  height?: string;
  onChange: (...args: any[]) => any;
  isDisable: boolean;
  require?: boolean;
  data: any[] | T[];
  value: string | number;
  name?: string;
  placeholder?: string;
  valueType?: string;
  titleType?: string;
  blockUndefined?: boolean;
  error?: string;
  title?: string;
}

const SelectBoxComponent = <T,>(props: ISelectBox<T>) => {
  const {
    width,
    height,
    require,
    onChange,
    isDisable,
    data,
    value,
    name,
    placeholder,
    valueType,
    title,
    titleType,
    blockUndefined,
  } = props;

  const [tooltip, setTooltip] = useState();

  return (
    <WrapperContainer width={width}>
      {title ? (
        <StyledTitle>
          {title}
          {require ? <RequireSpan>*</RequireSpan> : null}
        </StyledTitle>
      ) : null}
      <SelectBoxBase
        disabled={isDisable}
        placeholder={placeholder}
        onChange={(event) => {
          const changeValue = (event.target as HTMLSelectElement).value;
          onChange(changeValue);
          const object = data.find(
            (o) => (valueType ? eval(`o.${valueType}`) : o) == changeValue,
          );
          setTooltip(titleType && object ? eval(`object.${titleType}`) : object);
        }}
        value={value}
        name={name}
        title={tooltip ?? placeholder}
      >
        {blockUndefined ? null : <option key={`selectboxoption`} value={undefined}></option>}
        {data
          ? data.map((option: T, index: number) => {
              return (
                <option
                  key={`selectboxoption${index}`}
                  value={valueType ? eval(`option.${valueType}`) : option}
                >
                  {titleType ? eval(`option.${titleType}`) : option}
                </option>
              );
            })
          : null}
      </SelectBoxBase>
    </WrapperContainer>
  );
};

export default SelectBoxComponent;

const WrapperContainer = styled.fieldset<{ width?: string }>`
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

const RequireSpan = styled.span`
  color: red;
  margin-left: 2px;
`;

const SelectBoxBase = styled.select`
  width: 100%;
  border: 0px;
  background-color: transparent;
  height: 30px;
  padding: 3px;
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
