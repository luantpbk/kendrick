import { useEffect, useRef, useState } from 'react';
import React from 'react';
import './SelectSearch.css';
import styled from 'styled-components';
import useDebounce from 'src/hooks/useDebounce';

interface ISelectSearch {
  leftIcon?: string;
  leftAction?: () => void;
  value: string;
  placeholder: string;
  errorMessage?: string;
  data: any[];
  valueType?: string;
  titleType?: string;
  onChange: (value: string) => void;
  validator: () => void;
}

const SelectSearch = (props: ISelectSearch) => {

  const { leftIcon, leftAction, value, placeholder, errorMessage, data = [], valueType, titleType, onChange, validator } = props;
  const [keyword, setKeyword] = useState<string>();
  const [isShowOption, setShowOption] = useState(false);
  const [parrentWidth, setParrentWidth] = useState(0);
  const [options, setOptions] = useState([]);
  const optionRef = useRef<HTMLDivElement>();
  const keywordDebounce = useDebounce(keyword, 300) as string;
  const first = useRef(true);

  useEffect(() => {
    const safeData = Array.isArray(data) ? data : [];
    const nOptions = !keywordDebounce ? safeData : safeData.filter(item => titleType ? eval(`item.${titleType}`).toString().toLowerCase().includes(keywordDebounce.toLowerCase()) : item.toString().toLowerCase().includes(keywordDebounce.toLowerCase()));
    setOptions(nOptions ? [...nOptions] : []);

  }, [data, keywordDebounce, titleType])


  useEffect(() => {
    const safeData = Array.isArray(data) ? data : [];
    const selected = safeData.find(item => valueType ? eval(`item.${valueType}`) == value : item == value);
    const initKeyword = titleType && selected ? eval(`selected.${titleType}`) : selected;
    setKeyword(initKeyword);
  }, [data, titleType, value, valueType]);

  const handleClick = (event: MouseEvent) => {
    if (!optionRef?.current?.contains(event.target as Node)) {
      setShowOption(false);
    }
  };

  useEffect(() => {
    if (optionRef) {
      const boundingClient = optionRef.current.getBoundingClientRect();
      setParrentWidth(boundingClient.width);
    }
  }, [])

  useEffect(() => {
    if (isShowOption) {
      document.addEventListener('click', handleClick);
      first.current = false;
    } else {
      document.removeEventListener('click', handleClick);
      if (!first.current) validator();
    }
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [isShowOption, validator])


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(keyword && options.length > 0 ? valueType ? eval(`options[0].${valueType}`) : options[0] : undefined);
      setShowOption(false);
    }
  }

  return (
    <>
      <div className={`login-input ${errorMessage ? 'error' : ''}`} ref={optionRef} >
        <i className={leftIcon} onClick={leftAction} />
        <input
          type='text'
          placeholder={placeholder}
          value={keyword ?? ''}
          onChange={(event) => {
            setKeyword(event.target.value);
            setShowOption(true);
          }}
          onFocus={() => setShowOption(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => onChange(keyword && options.length > 0 ? valueType ? eval(`options[0].${valueType}`) : options[0] : undefined)}
        />
        {value ? <i className="fas fa-times" onClick={() => onChange(undefined)}></i> : null}
        <i className="fas fa-caret-down" onClick={() => setShowOption(!isShowOption)}></i>
      </div>
      {isShowOption ? <OptionContainer>
        {options.map((option, index) => {
          return (
            <OptionItem key={`selectboxoption${index}`}
              checked={valueType ? eval(`option.${valueType}`) == value : option == value}
              parrentWidth={parrentWidth}
              onClick={() => {
                onChange(valueType ? eval(`option.${valueType}`) : option);
                setShowOption(!isShowOption);
              }}
            >
              {titleType ? eval(`option.${titleType}`) : option}
            </OptionItem>
          );
        })}
      </OptionContainer> : null}
      <div className="login-form-error-text">{errorMessage}</div>

    </>
  );
};

export default SelectSearch;


const OptionItem = styled.div<{ parrentWidth: number, checked: boolean }>`
  background: ${({ checked }) => checked ? 'lightgray' : 'white'};
  min-width: ${({ parrentWidth }) => parrentWidth}px;
  margin-top: 1px;
  padding: 0 5px 5px 5px;
  :hover {
    background: lightgray;
  }
`;

const OptionContainer = styled.div`
  position: absolute;
  margin-top: -11px;
  background: lightgray;
  cursor: pointer;
  border: 1px solid lightgray;
  height: fit-content;
  max-height: 50vh;
  over-flow: auto;
  box-shadow: lightgray 0px 0px 2px 1px;
`;
