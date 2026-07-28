import './FilterBox.css';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FilterOptionBox, { FilterType } from './FilterOptionBox';

interface FilterBoxProps {
  filters: FilterType<object>[];
  onFilter: (...args: any[]) => void;
}

const FilterBox = (props: FilterBoxProps) => {
  const WIDTH = 260;
  const {
    filters,
    onFilter
  } = props;


  const el = useRef<HTMLDivElement>();
  const [selected, setSelected] = useState<FilterType<object>>();
  const [isStart, setStart] = useState(false);
  const [isShow, setShow] = useState<boolean>();

  const [optionSelected, setOptionSelected] = useState<{[filterKey: string]: any}>({});
  const [condition, setCondition] = useState<{[filterKey: string]: any}>({});
  const [parentTop, setParentTop] = useState(0);
  const [top, setTop] = useState<number>(0);

  const onChange = (filterKey: string, value: any) => {
    if(optionSelected[filterKey] == value) {
      optionSelected[filterKey] = undefined;
    } else {
      optionSelected[filterKey] = value;
    }
    setOptionSelected({...optionSelected});
  }

  return (
    <WrapperContainer ref={el}>
      {condition? Object.entries(condition).filter(([key, value]) => value != undefined).map(([key, value]) => {
        const filter = props.filters.find(f => f.filterKey == key);
        return (
          <StyledCondition key={key}>
            <div>{filter.title}</div>
            <div>{eval(`value.${filter.titleField}`)}</div>
            <StyledClearCondition className="material-icons" onClick={() => {
              condition[key] = undefined;
              setCondition({...condition});
              setOptionSelected({...condition});
              onFilter({...condition});
            }}>clear</StyledClearCondition>
          </StyledCondition>
        );
      }) : null}


      <StyledFilter show={isShow} onClick={() => {
        if(!isShow && el.current) {
          const boundingClient = el.current.getBoundingClientRect();
          console.log(boundingClient);
          setParentTop(boundingClient.y);
          setStart(boundingClient.x < WIDTH);

          setOptionSelected({...condition});
        }
        console.log(isStart);
        setShow(!isShow);
      }}>
        <StyledFilterLabel className="material-icons">filter_alt</StyledFilterLabel>
        <StyledFilterLabel>Bộ lọc</StyledFilterLabel>
      </StyledFilter>
      {isShow ? <StyledFilterBox isStart={isStart} width={WIDTH}>
        <StyledFilterHeader>BỘ LỌC<span style={{float: 'right'}} className="material-icons" onClick={() => setShow(false)}>clear</span></StyledFilterHeader>
        <StyledFilterContent>

          {filters.map((item: FilterType<object>, index: number) => {
            const isSelected = item == selected;
            return (
              <StyledFilterRow key={`filterrow${index}`} selected={isSelected} onClick={(e) => {
                if(item == selected) {
                  setSelected(undefined);
                } else {
                  setTop((e.target as HTMLElement).getBoundingClientRect().y - parentTop);
                  setSelected(item);
                }
              }}>
                <StyledFilterIcon selected={isSelected}/>
                <span>
                  {item.title} 
                  <StyledOptionSelect selected={isSelected}>
                    {optionSelected[item.filterKey]? eval(`optionSelected[item.filterKey].${item.titleField}`): 'Tất cả'}
                    {optionSelected[item.filterKey]? 
                      <StyledClearIcon className="material-icons" onClick={() => {
                        optionSelected[item.filterKey] = undefined;
                        setOptionSelected({...optionSelected});
                      }}>clear</StyledClearIcon> : null}
                  </StyledOptionSelect>
                </span>
              </StyledFilterRow>
            )

          })}
          <StyledFooter>
            <StyledFilterButton onClick={() => {
              onFilter(optionSelected);
              setCondition({...optionSelected});
              setShow(false);
            }}>Lọc</StyledFilterButton>
          </StyledFooter>
        </StyledFilterContent>
      </StyledFilterBox> : null}
      {isShow && selected? 
      <FilterOptionBox 
        isStart={isStart} 
        top={top} 
        change={onChange} 
        {...selected} 
        optionSelected={optionSelected[selected.filterKey]}
      /> : null}
         
    </WrapperContainer>
  );
};

export default FilterBox;



const StyledCondition = styled.div`
  position: relative;
  background-color: #53687e;
  color: white;
  border-radius: 5px;
  padding: 0 10px;
  margin: 10px;
  text-align: center;
`;

const StyledClearIcon = styled.span`
  position: absolute;
  bottom: 12px;
  color: white;
  background-color: #f13838;
  font-size: 16px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
`;

const StyledClearCondition = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  color: white;
  background-color: #f13838;
  font-size: 16px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
`;

const StyledOptionSelect = styled.span<{selected: boolean}>`
  position: relative;
  background-color: ${({selected}) => selected? `white` : `#53687e` };
  color: ${({selected}) => selected? `black` : `white` };
  border-radius: 5px;
  padding: 2px 8px;
  margin-left: 4px;
`;

const StyledFilterHeader = styled.div`
  text-align: center;
  background-color: #256cb8;
  color: white;
  font-weight: 500;
  width: 100%;
  padding: 5px;
`;

const StyledFooter = styled.div`
  background-color: white;
  width: 100%;
  padding: 5px;
`;

const StyledFilterButton = styled.button`
  background-color: #256cb8;
  border: none;
  outline: none;
  color: white;
  font-weight: 500;
  width: 100%;
`;

const WrapperContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledFilterContent = styled.div`
  background-color: gray;
`;

const StyledFilterBox = styled.div<{width: number, isStart: boolean}>`
  position: absolute;
  top: 50px;
  ${({isStart}) => `${isStart? 'left' : 'right'}: 0px`};
  width: ${({width}) => `${width}px`};
  box-shadow: gray 0px 4px 5px 0px;
  border: 1px solid #256cb8;;
`;


const StyledFilter = styled.button<{show: boolean}>`
  height: fit-content;
  margin: auto 10px;
  border: 1px solid #dddcdc;
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  ${({show}) => show? `background-color: #256cb8; color: white;` : `background-color: white`};
  font-weight: 500;
  display: flex;
  flex-direction: row;
  outline:none;
  :hover {
    background-color: ${({show}) => show? '#256cb8' : 'lightgray'};
  };
  :focus {
    outline:none;
    border: 1px solid #dddcdc;
  }
`;

const StyledFilterLabel = styled.div`
  vetical-alignt: center;
`;


const StyledFilterIcon = styled.div<{selected: boolean}>`
  width: 6px;
  height: 6px; 
  border-radius: 3px;
  background-color: ${({selected}) => selected? `white` : `#53687e` };
  margin: auto 10px auto 0;
`;


const StyledFilterRow = styled.div<{selected: boolean}>`
  vetical-align: middle;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid lightgray;
  padding: 8px 10px;
  background-color: ${({selected}) => selected? `#53687e` : `white` };
  color: ${({selected}) => selected? `white` : `black` };
  :hover {
    background-color: ${({selected}) => selected? `#53687e` : `lightgray` };
  }
`;