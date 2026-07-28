import React from 'react';
import { MouseEvent } from 'react';
import {
  useAddPopup,
  useGetStatusReload,
  useRemovePopup,
} from 'src/state/application/hooks';
import { AccountBalanceListType, EnumAction, EventButton } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import { useNavigate  } from 'react-router';
import useQuery from 'src/hooks/useQuery';
import { BASE_SETTING_URL } from 'src/constants';
import AccountBalanceDetail, {
  EnumConfigAccountBalanceDetail,
} from '../AccountBalanceDetail/AccountBalanceDetail';
import { useGetAccountBalanceList } from 'src/api/accountBalanceApi';

const AccountBalanceList: React.FC = () => {
  //Value
  const navigate = useNavigate();
  const query = useQuery();
  const page = query.get('page') ? Number(query.get('page')) : 1;
  const size = query.get('size') ? Number(query.get('size')) : 50;
  const keyword = query.get('keyword') ? query.get('keyword') : '';

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const reloadFlag = useGetStatusReload();
  const getAccountBalanceList = useGetAccountBalanceList();

  //Local state
  const [count, setCount] = useState<number>(null);
  const [accountBalanceList, setAccountBalanceList] = useState<AccountBalanceListType[]>([]);

  //Define
  const displayList: string[] = ['.user.fullName', '.user.email', '.moneyAmount'];
  const header: string[] = ['Tên', 'Email', 'Số tiền'];
  const typeList: string[] = ['string', 'string', 'number'];
  //End of define

  const onView = (userId: number) => {
    
    
    const url = `${BASE_SETTING_URL}/account-balance?userId=${userId}`;
    navigate(url);
  };

  //When click right mouse
  const onRightMouseClick = (e: MouseEvent, userId: number) => {
    const RIGHT_MOUSE_BUTTON = 2;
    const listToDo: EventButton[] = [
      {
        name: 'Chi tiết',
        icon: 'info',
        actionType: EnumAction.Edit,
        action: () => onView(userId),
        buttonClass: 'info',
        align: 'left',
      },
    ];

    
    if (e.button === RIGHT_MOUSE_BUTTON) {
      const posX =
        e.clientX >= 0 && e.clientX <= window.innerWidth
          ? e.clientX
          : e.clientX < 0
          ? e.clientX + window.innerWidth
          : e.clientX - window.innerWidth;
      const posY =
        e.clientY >= 0 && e.clientY <= window.innerHeight
          ? e.clientY
          : e.clientY < 0
          ? e.clientY + window.innerHeight
          : e.clientY - window.innerHeight;
      addPopup({
        context: {
          width: '160px',
          height: '40px',
          listActionButton: listToDo,
          posX: `${posX.toString()}px`,
          posY: `${(posY - 60).toString()}px`,
        },
      });
    }
  };
  //End of menucontext

  const onDoubleClick = (userId: number, index: number) => {
   
    // //hiddenSLideBar();
    const url = `${BASE_SETTING_URL}/account-balance?userId=${userId}`;
    navigate(url);
  };

  //Function in the listButton
  const onAddMoney = () => {
   
    // //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '400px',
      //   height: '300',
      //   title: 'Nạp tiền',
      //   isManualRemove: true,
      //   data: <AccountBalanceDetail config={EnumConfigAccountBalanceDetail.add} />,
      //   isContext: false,
      // },
    });
  };

  const onDeductMoney = () => {
   
    // //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '400px',
      //   height: '300',
      //   title: 'Trừ tiền',
      //   isManualRemove: true,
      //   data: <AccountBalanceDetail config={EnumConfigAccountBalanceDetail.deduct} />,
      //   isContext: false,
      // },
    });
  };

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Nạp tiền',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onAddMoney,
      align: 'center',
    },
    {
      name: 'Trừ tiền',
      icon: 'remove',
      actionType: EnumAction.View,
      buttonClass: 'info sim-order-tool-btn',
      action: onDeductMoney,
      align: 'center',
    },
  ];

  const onChangeToolBar = (name: string, _value: string) => {
    if (name === 'keyword') {
      const url = `${BASE_SETTING_URL}/account-balance-list?keyword=${_value}&page=1&size=${size}`;
      navigate(url);
    } else if (name === 'page') {
      const url = `${BASE_SETTING_URL}/account-balance-list?keyword=${keyword}&page=${Number(
        _value,
      )}&size=${size}`;
      navigate(url);
    } else if (name === 'size') {
      const url = `${BASE_SETTING_URL}/account-balance-list?keyword=${keyword}&page=1&size=${Number(
        _value,
      )}`;
      navigate(url);
    }
  };
  //End of toolbar

  //useEffect
  useEffect(() => {
    getAccountBalanceList([])
      .then((data) => {
        setCount(data.count);
        setAccountBalanceList(data.items);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getAccountBalanceList, keyword, page, reloadFlag]);

  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Danh sách tài khoản tiền'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        count={count}
        onChangeToolBar={onChangeToolBar}
        keyword={keyword}
        page={page}
        size={size}
        isPaging={true}
        listCheckbox={[]}
      /> */}
      {/* <Table
        key={'table account balance list'}
        header={header}
        tableType={'label'}
        isDisable={true}
        data={accountBalanceList}
        onRightMouseClick={onRightMouseClick}
        displayList={displayList}
        manage={'.userId'}
        typeList={typeList}
        onDoubleClick={onDoubleClick}
      /> */}
    </div>
  );
};
export default AccountBalanceList;
