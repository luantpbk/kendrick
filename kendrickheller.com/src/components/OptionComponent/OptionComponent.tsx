import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface IOptionComponent<T> {
  width?: string;
  onChange?: (...args: any[]) => any;
  isDisable?: boolean;
  data: any[];
  value: T;

  valueType?: string;
  titleType?: string;
  disabled?: boolean;
}

const OptionComponent = <T,>(props: IOptionComponent<T>) => {
  const {
    width,
    onChange,
    isDisable,
    data,
    value,
    valueType,
    titleType,
  } = props;
  const { t, i18n } = useTranslation();
  const [isShowOption, setShowOption] = useState(false);
  const [parrentWidth, setParrentWidth] = useState(0);
  const optionRef = useRef<HTMLDivElement>();
  const [titleValue, setTitleValue] = useState();
  const handleClick = (event: MouseEvent) => {
    if (!optionRef?.current?.contains(event.target as Node)) {
      setShowOption(false);
    }
  };

  useEffect(() => {
    if (isShowOption) {
      document.addEventListener('click', handleClick);
    } else {
      document.removeEventListener('click', handleClick);
    }
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [isShowOption])

  useEffect(() => {
    const selected = data.find(item => valueType ? eval(`item.${valueType}`) == value : item == value);
    const init = titleType && selected ? eval(`selected.${titleType}`) : selected;
    setTitleValue(init);
  }, [data, titleType, value, valueType]);


  return (
    <WrapperContainer width={width} ref={optionRef}>
      <SelectBoxBase ref={(el) => {
        if (el) {
          const boundingClient = el.getBoundingClientRect();
          setParrentWidth(boundingClient.width);
        }
      }} title={t(titleValue)} onClick={() => { if (!isDisable) setShowOption(!isShowOption) }}><OptionTitle>{t(titleValue)}</OptionTitle><OptionTitle className="material-icons">arrow_drop_down</OptionTitle></SelectBoxBase>
      {isShowOption ? <OptionContainer>
        {data.map((option, index) => {

          return (
            <OptionItem key={`selectboxoption${index}`}
              parrentWidth={parrentWidth}
              onClick={() => {
                onChange(valueType ? eval(`option.${valueType}`) : option);
                setShowOption(!isShowOption);
              }}
            >
              {t(titleType ? eval(`option.${titleType}`) : option)}
            </OptionItem>
          );
        })}
      </OptionContainer> : null}

    </WrapperContainer>
  );
};

export default OptionComponent;

const WrapperContainer = styled.div<{ width?: string }>`
  width: ${({ width }) => (width ? width : 'fit-content')};
  margin: 5px;
  position: relative;
`;

const OptionTitle = styled.span`
  margin: auto 0;
  vertical-align: middle;
  width: fit-content;
`;

const OptionItem = styled.div<{ parrentWidth: number }>`
  background: #c1bfbf;
  width: 100%;
  min-width: ${({ parrentWidth }) => parrentWidth}px;
  margin-top: 1px;
  padding: 0 5px 5px 5px;
`;

const OptionContainer = styled.div`
  position: absolute;
  width: fit-content;
  background: lightgray;
  cursor: pointer;
  z-index: 1;
`;

const SelectBoxBase = styled.div`
  background: #605e5e;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 3px 0px 3px 6px;
  color: white;
  cursor: pointer;
`;
