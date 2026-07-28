import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface OptionPriceProps {
  disabled?: boolean;
  onChange?: (value: {[key: string]: number}) => void;
  value?: {[key: string]: number};
  title: string;
}

const OptionPrice = (props: OptionPriceProps) => {
  const { title, disabled, onChange, value } = props;

  const [prices, setPrices] = useState<{[key: string]: number}>({});
  const [option, setOption] = useState<string>();
  const [price, setPrice] = useState<number>();

  useEffect(() => {
    if (value) {
      setPrices(value);
    }
  }, [value]);

  return (
    <StyledPriceWrapper>
      <StyledTitle>{title}</StyledTitle>
      <StyledPriceContainer >
        {Object.entries(prices).map(([key, value]) => (
          <StyledPrice key={`option-price${key}`}>
            {!disabled && (
              <StyledClearIcon
                className="material-icons"
                onClick={() => {
                  const nPrices = {...prices};
                  if (key in nPrices) {
                    delete nPrices[key];
                  }
                  onChange(nPrices);
                }}
              >
                clear
              </StyledClearIcon>
            )}

            <StyledPriceLabel>{key}</StyledPriceLabel>
            <StyledPriceInput
              disabled={disabled}
              value={value}
              onChange={(event) => {
                const nPrices = {...prices};
                nPrices[key] = Number((event.target as HTMLInputElement).value);
                onChange(nPrices);
              }}
              type='number'
            />
          </StyledPrice>
        ))}
        {!disabled && (
          <StyledPrice>
            <StyledPriceInput
              disabled={disabled}
              value={option}
              onChange={(event) => {
                setOption((event.target as HTMLInputElement).value);
              }}
            /><StyledVerticalLine/>
            <StyledPriceInput
              disabled={disabled}
              value={price}
              onChange={(event) => {
                setPrice(Number((event.target as HTMLInputElement).value));
              }}
              type='number'
            />
            <span className="material-icons " onClick={() =>  {
              if(option && price > 0) {
                prices[option] = price;
                onChange({...prices});
                setOption("");
                setPrice(0);
              }
            }}>add_circle</span>
          </StyledPrice>
          
        )}
      </StyledPriceContainer>
    </StyledPriceWrapper>
  );
};



const StyledClearIcon = styled.span`
  position: absolute;
  top: -2px;
  left: -3px;
  color: white;
  background-color: #f13838;
  font-size: 12px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  cursor: pointer;
`;

const StyledPriceWrapper = styled.fieldset`
  border: 1px solid #dddcdc;
  flex: 1;
  padding: 5px 10px;
  border-radius: 5px;
`;

const StyledTitle = styled.legend`
  font-size: medium;
  margin-bottom: -5px;
  padding: 0 5px 3px 5px;
  width: fit-content;
`;

const StyledPriceContainer = styled.div`
  display: flex;
  max-width: 80vw;
  flex-direction: column;
`;

const StyledPrice = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 0 2px;
  margin: 2px 3px;
  border: 1px solid #256cb8;
`;

const StyledPriceInput = styled.input`
  width: 100%;
  border: none;
  text-align: left;
  background: transparent;
`;

const StyledVerticalLine = styled.div`
  width: 1px;
  heigh: 100%;
  background: #256cb8;
`;

const StyledPriceLabel = styled.label`
  width: 100%;
  text-align: center;
  background: #256cb8;
  margin: auto;
  color: white;
`;

export default OptionPrice;
