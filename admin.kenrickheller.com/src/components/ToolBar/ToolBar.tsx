import './ToolBar.css';
import { useState } from 'react';
import React from 'react';
import {
  EnumAction,
  EventButton,
} from 'src/api/models';
import styled from 'styled-components';
import ButtonAction from '../ButtonAction/ButtonAction';
import Input from '../Input/Input';
import SelectBoxComponent from '../SelectBoxComponent/SelectBoxComponent';
import { useEffect } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import FilterBox from '../FilterBox/FilterBox';
import { FilterType } from '../FilterBox/FilterOptionBox';



interface IToolBar {
  width?: string;
  height?: string;
  backgroundColor: string;
  toolbarName: string;
  isBack?: boolean;
  listLeftButton?: EventButton[];
  listRightButton?: EventButton[];
  isPaging: boolean;
  count?: number;
  keyword?: string;
  page?: number;
  size?: number;filters?: FilterType<object>[];
  onFilter?: (...args: any[]) => void;
  onSearch?: (value: string) => void;
  onChangePage?: (page: number) => void;
  onChangeSize?: (size: number) => void;
}

const ToolBar: React.FC<IToolBar> = (props) => {
  //Value
  const {
    width,
    height,
    backgroundColor,
    toolbarName,
    isBack,
    listLeftButton,
    listRightButton,
    isPaging,
    count,
    keyword,
    page,
    size,
    filters,
    onFilter,
    onSearch,
    onChangePage,
    onChangeSize
  } = props;


  //Local state
  const [maxPage, setMaxPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  //End of state

  //Component
  // const keywordInput = () => {
  //   return (
  //     <>
  //       <div className={`sim-input focus-input ${keyword ? 'validate-input' : ''}`}>
  //         <div className="sim-input-title">CTV</div>
  //         <input
  //           type="text"
  //           value={search}
  //           onChange={(event) => {
  //             setSearch(event.target.value);
  //           }}
  //           onFocus={() => {
  //             setIsShowUserList(true);
  //           }}
  //         />
  //       </div>
  //     </>
  //   );
  // };

  //TODO
  // const orderRequirementProgressStatusOption = () => {
  //   return (
  //     <div>
  //       <select
  //         value={orderRequirementProgressStatus.toString()}
  //         className="sim-price-detail-option"
  //         onChange={(event) => {
  //           setOrderRequirementProgressStatus(Number(event.target.value));
  //           event.preventDefault();
  //         }}
  //       >
  //         <option value={'default'}>Trạng thái</option>
  //         <option value={'1'}>Chờ gửi</option>
  //         <option value={'2'}>Đã gửi</option>
  //         <option value={'3'}>Lỗi gửi</option>
  //       </select>
  //     </div>
  //   );
  // };

  // const userListComponent = () => {
  //   return (
  //     <div className="user-list">
  //       <div
  //         className="user-item-container"
  //         onClick={() => {
  //           setUserId(null);
  //           setIsShowUserList(false);
  //           setSearch('');
  //         }}
  //       >
  //         <i>LOẠI BỎ TÌM KIẾM THEO USERID</i>
  //       </div>
  //       {userList
  //         ? userList.map((value) => {
  //             return (
  //               <div
  //                 key={uniqueId()}
  //                 className="user-item-container"
  //                 title={value.email}
  //                 onClick={() => {
  //                   setUserId(value.userId);
  //                   setIsShowUserList(false);
  //                   setSearch(value.fullName);
  //                 }}
  //               >
  //                 <div>{value.fullName}</div>
  //                 <i>{value.email}</i>
  //               </div>
  //             );
  //           })
  //         : null}
  //     </div>
  //   );
  // };


  // const filterPurchaseAccount = () => {
  //   return (
  //     <div className="is-sim-order-con">
  //       <button
  //         className="is-sim-order-con-btn"
  //         onClick={() => {
  //           setIsShowPurchaseAccountFilter(!isShowPurchaseAccountFilter);
  //         }}
  //       >
  //         Bộ lọc
  //       </button>
  //       {isShowPurchaseAccountFilter ? (
  //         <div className="is-sim-order-wrap">
  //           {keywordInput()}
  //           {isShowUserList ? userListComponent() : null}
  //           <button
  //             className="is-sim-order-con-btn-fill"
  //             onClick={() => {;
  //               setIsShowPurchaseAccountFilter(false);
  //             }}
  //           >
  //             Lọc
  //           </button>
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // };

  // const filterOrderRequirement = () => {
  //   return (
  //     <div className="is-sim-order-con">
  //       <button
  //         className="is-sim-order-con-btn"
  //         onClick={() => {
  //           setIsShowOrderRequirement(!isShowOrderRequirement);
  //         }}
  //       >
  //         Bộ lọc
  //       </button>
  //       {isShowOrderRequirement ? (
  //         <div className="is-sim-order-wrap">
  //           {orderRequirementProgressStatusOption()}
  //           <button
  //             className="is-sim-order-con-btn-fill"
  //             onClick={() => {
  //               onFillterOrderRequirement();
  //               setIsShowOrderRequirement(false);
  //             }}
  //           >
  //             Lọc
  //           </button>
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // };
  //End of component

  // //TODO
  // const onFillterOrderRequirement = () => {
  //   const _progressStatus = orderRequirementProgressStatus
  //     ? orderRequirementProgressStatus
  //     : '';
  //   const url = `${BASE_WEB_URL}/order-requirement?keyword=${keyword}&page=1&size=${size}&progressStatus=${_progressStatus}`;
  //   navigate(url);
  // };

  //End of function

  //Init
  useEffect(() => {
    if (count % size == 0) {
      setMaxPage(count / size);
    } else {
      setMaxPage(Math.floor(count / size) + 1);
    }
  }, []);

  const backButton: EventButton = {
    icon: 'arrow_back',
    actionType: EnumAction.View,
    action: () => navigate(-1),
    align: 'center',
  };

  return (
    <WrapperContainer
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      <FlexRowWrapper>
        <FlexRowWrapper>
          {isBack && <ButtonAction key={`backbutton`} button={backButton}/>}
          {listLeftButton? listLeftButton.map((button: EventButton, index: number) => {
            return <ButtonAction key={`toolbarleftbutton${index}`} button={button}/>;
          }) : null}
        </FlexRowWrapper>
        
        <ToolBarName>{toolbarName}</ToolBarName>
        <FlexRowWrapper>
          {listRightButton? listRightButton.map((button: EventButton, index: number) => {
            return <ButtonAction isFile={button.file} key={`toolbarrightbutton${index}`} button={button}/>;
          }) : null}
        </FlexRowWrapper>
      </FlexRowWrapper>
     


      <FlexRowWrapper>
        {onSearch != undefined? <SearchInput>
          <Input
            disabled={false}
            value={keyword}
            placeholder={'Bạn muốn tìm gì?'}
            onChange={onSearch}
          />
        </SearchInput> : null}
        {filters && filters.length > 0 ? <FilterBox filters={filters} onFilter={ onFilter}/>  : null}
        {isPaging? <>
          <PagingContainer>
            <PagingItem>
              <ButtonAction
                button={{
                  icon: 'navigate_before',
                  actionType: EnumAction.View,
                  action: () => {
                    if (page > 1) onChangePage(page - 1);
                  },
                  align: 'center',
                }}
              />
            </PagingItem>
            <PagingItem>
              {(page - 1) * size + 1}-{Math.min(page * size, count)}/{count}
            </PagingItem>
            <PagingItem>
              <SelectBoxComponent
                onChange={onChangePage}
                isDisable={false}
                data={Array.from({length: maxPage}, (v, i) => i + 1)}
                value={page}
                blockUndefined={true}
              />
            </PagingItem>
            <PagingItem>
              <ButtonAction
                button={{
                  icon: 'navigate_next',
                  actionType: EnumAction.View,
                  action: () => {
                    if (page < maxPage) onChangePage(page + 1);
                  },
                  align: 'center',
                }}
              />
            </PagingItem>
            <PagingItem>
              <SelectBoxComponent
                onChange={onChangeSize}
                isDisable={false}
                data={Array.from({length: 5}, (v, i) => (i + 1) * 50)}
                value={size}
                blockUndefined={true}
              />
            </PagingItem>
            
          </PagingContainer>
         
        
        </> : null}
      </FlexRowWrapper>
    </WrapperContainer>
  );
};

export default ToolBar;


const PagingContainer = styled.div`
  height: fit-content;
  margin: auto;
  display: flex;
  flex-direction: row;
  vertical-align: middle;
`;

const PagingItem = styled.div`
  height: fit-content;
  margin: auto 2px;
`;



const SearchInput = styled.div`
  background-color: white;
  border-radius: 5px;
  height: fit-content;
  margin: auto;
`;


const WrapperContainer = styled.div<{ width: string; height: string; backgroundColor: string }>`
  width: ${({ width }) => width || 'fit-content'};
  height: ${({ height }) => height || 'fit-content'};
  background-color: ${({ backgroundColor }) => backgroundColor || 'white'};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 4px;
`;

const FlexRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 2px 0;
  margin: auto 2px;
`;

const ToolBarName = styled.div`
  font-size: medium;
  font-weight: 500;
  max-width: 400px;
  padding: 0 10px;
  margin: auto;
`;
