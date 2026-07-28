
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export interface FilterType<T> {
  data?: T[] | Promise<T>;
  valueField: string;
  titleField: string;
  title: string;
  filterKey: string;
}

export interface FilterTypeProp<T> extends FilterType<T>{
  isStart: boolean;
  top: number;
  optionSelected?: T;
  change: (...args: any[]) => any;
}


const FilterOptionBox = <T, > (props: FilterTypeProp<T>) => {
  const WIDTH = 260;
  const {
    isStart,
    top,
    optionSelected,
    data,
    valueField,
    titleField,
    filterKey,
    change,
  } = props;

  const [options, setOptions] = useState<T[]>([]);

  

  useEffect(() => {
    if(Array.isArray(data)) {
      setOptions(data);
    }
  }, [data]);

  return (
    <StyledFilterBox isStart={isStart} top={top} width={WIDTH}> 
    {
      options.map((option, index) => (
        <StyledFilterRow 
          selected={optionSelected && eval(`option.${valueField}`) == eval(`optionSelected.${valueField}`)}
          key={`filteroption${index}`}
          onClick={() => {
            change(filterKey, option);
          }}
        >
          {eval(`option.${titleField}`)}
        </StyledFilterRow>)
      )
    }
    </StyledFilterBox>
  );
};

export default FilterOptionBox;

const StyledFilterRow = styled.div<{selected: boolean}>`
  vetical-align: middle;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid lightgray;
  padding: 5px 10px;
  background-color: ${({selected}) => selected? `#53687e` : `white` };
  color: ${({selected}) => selected? `white` : `black` };
  :hover {
    background-color: ${({selected}) => selected? `#53687e` : `lightgray` };
  }
`;


const StyledFilterBox = styled.div<{width: number, isStart: boolean, top: number}>`
  position: absolute;
  top: ${({top}) => `${top}px`};
  ${({width, isStart}) => `${isStart? 'left' : 'right'}: ${width}px`};
  width: ${({width}) => `${width}px`};
  box-shadow: gray 0px 4px 5px 0px;
  border: 1px solid #256cb8;;
`;
