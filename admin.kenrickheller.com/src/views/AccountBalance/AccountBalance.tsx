import './AccountBalance.css';
import React from 'react';
import {
  useAddPopup,
  useGetStatusReload,
} from 'src/state/application/hooks';
import { useEffect, useState } from 'react';
import Calendar, { EnumCalendarAlign, EnumCalendarPos } from 'src/components/Calendar/Calendar';
import Table from 'src/components/Table/Table';
import { AccountBalanceType, EnumAction, EventButton } from 'src/api/models';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useNavigate  } from 'react-router-dom';
import useQuery from 'src/hooks/useQuery';
import { BASE_SETTING_URL } from 'src/constants';
import { useGetAccountBalance, useGetAccountBalanceHistory } from 'src/api/accountBalanceApi';
import { useGetUserById } from 'src/api/userApi';
import { EnumConfigAccountBalanceDetail } from './AccountBalanceDetail/AccountBalanceDetail';
import AccountBalanceMoney from './AccountBalanceMoney/AccountBalanceMoney';

enum EnumDateType {
  Tuan = 1,
  Thang = 2,
  Quy = 3,
  Nam = 4,
}

enum EnumDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

const AccountBalance: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const page = query.get('page') ? Number(query.get('page')) : 1;
  const size = query.get('size') ? Number(query.get('size')) : 20; //20 50 100
  const keyword = query.get('keyword') ? query.get('keyword') : '';
  const userId = query.get('userId') ? query.get('userId') : '';
  const reloadFlag = useGetStatusReload();

  //Define
  const displayList: string[] = ['.createdAt', '.accountActionTitle', '.moneyAmount', '.note'];
  const header: string[] = ['Ngày', 'Tiêu đề', 'Số tiền', 'Nội dung'];
  const typeList: string[] = ['status', 'string', 'number', 'string'];

  //State
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [accountBalanceHistoryList, setAccountBalanceHistoryList] = useState<
    AccountBalanceType[]
  >([]);
  const [name, setName] = useState('');

  const [dateType, setDateType] = useState<EnumDateType>(EnumDateType.Thang);

  const [week, setWeek] = useState(null);
  const [month, setMonth] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState(null);

  const [elmTuan, setElmTuan] = useState([]);
  const [elmThang, setElmThang] = useState([]);
  const [elmQuy, setElmQuy] = useState([]);
  const [elmNam, setElmNam] = useState([]);

  //Count
  const [count, setCount] = useState<number>(null);

  //Function
  const addPopup = useAddPopup();
  const getAccountBalanceHistory = useGetAccountBalanceHistory();
  const getAccountBalance = useGetAccountBalance();
  const getUserById = useGetUserById();

  const onChangeToolBar = (name: string, _value: string) => {
    if (name === 'keyword') {
      const url = `${BASE_SETTING_URL}/account-balance?userId=${userId}&keyword=${_value}&page=1&size=${size}`;
      navigate(url);
    } else if (name === 'page') {
      const url = `${BASE_SETTING_URL}/account-balance?userId=${userId}&keyword=${keyword}&page=${Number(
        _value,
      )}&size=${size}`;
      navigate(url);
    } else if (name === 'size') {
      const url = `${BASE_SETTING_URL}/account-balance?userId=${userId}&keyword=${keyword}&page=1&size=${Number(
        _value,
      )}`;
      navigate(url);
    }
  };

  const toNumberFunction = (num: number) => {
    if (num !== null) {
      const string = num.toString();
      const length = string.length;
      let result = '';
      let textIndex = 0;

      if (num != 0) {
        if (string[0] != '-') {
          if (string.length > 3) {
            for (let index = length - 3; index >= 0; index -= 3) {
              result = string.substr(index, 3) + '.' + result;
              textIndex = index;
            }
            result = result.substr(0, result.length - 1);
            if (textIndex != 0) {
              result = string.substr(0, textIndex) + '.' + result;
            }

            return result;
          } else {
            return string;
          }
        } else {
          if (string.length > 4) {
            for (let index = length - 3; index >= 1; index -= 3) {
              result = string.substr(index, 3) + '.' + result;
              textIndex = index;
            }
            result = result.substr(0, result.length - 1);
            if (textIndex != 1) {
              result = string.substr(0, textIndex) + '.' + result;
            } else {
              result = '-' + result;
            }

            return result;
          } else {
            return string;
          }
        }
      } else {
        return 0;
      }
    }
  };

  const onChangeToMonthType = (mm: number, yy: number) => {
    const numberOfMiliSecond = 86400000;
    const fDate = `1/${mm}/${yy}`;

    if (mm < 12) {
      const temp = new Date(`${yy}/${Number(mm) + 1}/1`);
      const to_date = new Date(temp.getTime() - 1 * numberOfMiliSecond);

      const dd2 = to_date.getDate();
      const mm2 = to_date.getMonth() + 1;
      const yy2 = to_date.getFullYear();

      const tDate = `${dd2}/${mm2}/${yy2}`;

      setFromDate(fDate);
      setToDate(tDate);
    } else {
      const tDate = `31/12/${year}`;
      setFromDate(fDate);
      setToDate(tDate);
    }
  };

  const onChangeToQuarterType = (qq: number, yy: number) => {
    const numberOfMiliSecond = 86400000;
    const fDate = `1/${qq * 3 - 2}/${yy}`;

    if (qq < 4) {
      const temp = new Date(`${yy}/${qq * 3 + 1}/1`);
      const to_date = new Date(temp.getTime() - 1 * numberOfMiliSecond);

      const dd2 = to_date.getDate();
      const mm2 = to_date.getMonth() + 1;
      const yy2 = to_date.getFullYear();

      const tDate = `${dd2}/${mm2}/${yy2}`;

      setFromDate(fDate);
      setToDate(tDate);
    } else {
      const tDate = `31/12/${year}`;
      setFromDate(fDate);
      setToDate(tDate);
    }
  };

  const onChantoYearType = (yy: number) => {
    const fDate = `1/1/${yy}`;
    const tDate = `31/12/${yy}`;

    setFromDate(fDate);
    setToDate(tDate);
  };

  const onChangeDateType = (dType: EnumDateType) => {
    if (dType == EnumDateType.Tuan) {
      onChangeToWeekType(week, year);
    } else if (dType == EnumDateType.Thang) {
      onChangeToMonthType(month, year);
    } else if (dType == EnumDateType.Quy) {
      onChangeToQuarterType(quarter, year);
    } else if (dType == EnumDateType.Nam) {
      onChantoYearType(year);
    }
  };

  const onChangeToWeekType = (ww: number, yy: number) => {
    let count: number;
    const numberOfMiliSecond = 86400000;
    const a = new Date(`${yy}/1/1`);
    const toDay = new Date();

    const day = toDay.getDay();

    switch (day) {
      case EnumDay.Monday:
        count = 0;
        break;
      case EnumDay.Tuesday:
        count = 1;
        break;
      case EnumDay.Wednesday:
        count = 2;
        break;
      case EnumDay.Thursday:
        count = 3;
        break;
      case EnumDay.Friday:
        count = 4;
        break;
      case EnumDay.Saturday:
        count = 5;
        break;
      case EnumDay.Sunday:
        count = 6;
        break;
    }

    const b = new Date(toDay.getTime() - count * numberOfMiliSecond);
    const numberOfWeek = Math.floor((b.getTime() - a.getTime()) / numberOfMiliSecond / 7);
    const c = new Date(b.getTime() - numberOfWeek * 7 * numberOfMiliSecond);

    const fDate = new Date(c.getTime() + (ww - 1) * 7 * numberOfMiliSecond);
    const tDate = new Date(fDate.getTime() + 6 * numberOfMiliSecond);
    const dd1 = fDate.getDate();
    const mm1 = fDate.getMonth() + 1;
    const yy1 = fDate.getFullYear();
    const dd2 = tDate.getDate();
    const mm2 = tDate.getMonth() + 1;
    const yy2 = tDate.getFullYear();

    const temp1 = `${dd1}/${mm1}/${yy1}`;
    const temp2 = `${dd2}/${mm2}/${yy2}`;
    setFromDate(temp1);
    setToDate(temp2);
  };

  const onRightMouseClick = () => {
    console.log('right mouse');
  };

  const onDoubleClick = () => {
    console.log('double click');
  };

  const onChangeFromDate = (fDate: string) => {
    setFromDate(fDate);
  };

  const onChangeToDate = (tDate: string) => {
    setToDate(tDate);
  };

  //Function in the listButton
  const onAddMoney = () => {
   
    // //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '400px',
      //   height: '400px',
      //   title: 'Nạp tiền',
      //   isManualRemove: true,
      //   data: (
      //     <AccountBalanceMoney
      //       config={EnumConfigAccountBalanceDetail.add}
      //       userId={Number(userId)}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onDeductMoney = () => {
   
    // //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '400px',
      //   height: '400px',
      //   title: 'Trừ tiền',
      //   isManualRemove: true,
      //   data: (
      //     <AccountBalanceMoney
      //       config={EnumConfigAccountBalanceDetail.deduct}
      //       userId={Number(userId)}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  //Button
  const listButton: EventButton[] = [
    {
      name: 'Nạp tiền',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info sim-order-tool-btn',
      action: onAddMoney,
      align: 'center',
    },
    {
      name: 'Trừ tiền',
      icon: 'remove',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onDeductMoney,
      align: 'center',
    },
  ];

  //useEffect
  useEffect(() => {
    const numberOfMiliSecond = 86400000;
    let count: number;
    let monthTemp, quarterTemp;

    const date = new Date();
    const mm1 = date.getMonth() + 1;
    const yy1 = date.getFullYear();
    const day = date.getDay();

    switch (day) {
      case EnumDay.Monday:
        count = 0;
        break;
      case EnumDay.Tuesday:
        count = 1;
        break;
      case EnumDay.Wednesday:
        count = 2;
        break;
      case EnumDay.Thursday:
        count = 3;
        break;
      case EnumDay.Friday:
        count = 4;
        break;
      case EnumDay.Saturday:
        count = 5;
        break;
      case EnumDay.Sunday:
        count = 6;
        break;
    }

    switch (mm1) {
      case 1:
      case 2:
      case 3:
        quarterTemp = 1;
        break;
      case 4:
      case 5:
      case 6:
        quarterTemp = 2;
        break;
      case 7:
      case 8:
      case 9:
        quarterTemp = 3;
        break;
      case 10:
      case 11:
      case 12:
        quarterTemp = 4;
        break;
    }

    switch (mm1) {
      case 1:
        monthTemp = 1;
        quarterTemp = 1;
        break;
      case 2:
        monthTemp = 2;
        quarterTemp = 1;
        break;
      case 3:
        monthTemp = 3;
        quarterTemp = 1;
        break;
      case 4:
        monthTemp = 4;
        quarterTemp = 2;
        break;
      case 5:
        monthTemp = 5;
        quarterTemp = 2;
        break;
      case 6:
        monthTemp = 6;
        quarterTemp = 2;
        break;
      case 7:
        monthTemp = 7;
        quarterTemp = 3;
        break;
      case 8:
        monthTemp = 8;
        quarterTemp = 3;
        break;
      case 9:
        monthTemp = 9;
        quarterTemp = 3;
        break;
      case 10:
        monthTemp = 10;
        quarterTemp = 4;
        break;
      case 11:
        monthTemp = 11;
        quarterTemp = 4;
        break;
      case 12:
        monthTemp = 12;
        quarterTemp = 4;
        break;
    }

    const a = new Date(`${yy1}/1/1`);

    const fDay = new Date(date.getTime() - count * numberOfMiliSecond);
    const numberOfWeek = Math.floor((fDay.getTime() - a.getTime()) / numberOfMiliSecond / 7);

    const mm2 = fDay.getMonth() + 1;
    const yy2 = fDay.getFullYear();

    const fTemp = `01/${mm2}/${yy2}`;

    if (mm2 < 12) {
      const temp = new Date(`${yy2}/${Number(mm2 + 1)}/1`);
      const to_date = new Date(temp.getTime() - 1 * numberOfMiliSecond);
      const d1 = to_date.getDate();
      const m1 = to_date.getMonth() + 1;
      const tDate = `${d1}/${m1}/${yy2}`;

      setToDate(tDate);
    } else {
      const tDate = `31/12/${yy2}`;

      setToDate(tDate);
    }

    setFromDate(fTemp);

    setWeek(numberOfWeek + 1);
    setYear(yy1);
    setMonth(monthTemp);
    setQuarter(quarterTemp);
  }, []);

  useEffect(() => {
    const eTuan = [],
      eThang = [],
      eQuy = [],
      eNam = [];
    for (let i = 2021; i < 2030; i++) {
      const elm = <option value={i}>{i}</option>;
      eNam.push(elm);
    }
    for (let i = 1; i <= 52; i++) {
      const elm = <option value={i}>{i}</option>;
      eTuan.push(elm);
    }
    for (let i = 1; i <= 4; i++) {
      const elm = <option value={i}>{i}</option>;
      eQuy.push(elm);
    }
    for (let i = 1; i <= 12; i++) {
      const elm = <option value={i}>{i}</option>;
      eThang.push(elm);
    }

    setElmNam(eNam);
    setElmTuan(eTuan);
    setElmQuy(eQuy);
    setElmThang(eThang);
  }, []);

  useEffect(() => {
    if (userId) {
      getAccountBalance(Number(userId))
        .then((data) => {
          setMoneyAmount(Number(data));
          addPopup({
            txn: {
              success: true,
              summary: 'Lấy thông tin thành công',
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      //TODO
      addPopup({
        txn: {
          success: false,
          summary: 'Chưa đủ thông tin',
        },
      });
    }
  }, [addPopup, getAccountBalance, userId, reloadFlag]);

  useEffect(() => {
    if (userId && userId != '' && fromDate && toDate) {
      getAccountBalanceHistory(keyword, page, size, Number(userId), fromDate, toDate)
        .then((data) => {
          setCount(data.count);
          setAccountBalanceHistoryList(data.items);
          console.log(data);
          console.log(fromDate);
          console.log(toDate);
        })
        .catch((error) => {
          console.log('account balance error');
          console.log(error);
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [
    addPopup,
    getAccountBalanceHistory,
    keyword,
    page,
    size,
    userId,
    reloadFlag,
    fromDate,
    toDate,
  ]);

  useEffect(() => {
    if (userId) {
      getUserById(Number(userId))
        .then((data) => {
          setName(data.fullName + ' ' + data.email);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getUserById, userId]);
  //End of useEffect

  //Main
  return (
    <div>
      <div className="account-balance-container">
        <div className="account-balance-slide-container">
          <div className="account-balance-title-component">Tìm kiếm</div>
          <div className="account-balance-slide-from-date title">Từ ngày</div>
          <div className="account-balance-slide-from-date">
            <div className="account-balance-slide-from-date-input">{fromDate}</div>
            <Calendar
              align={EnumCalendarAlign.left}
              pos={EnumCalendarPos.bot}
              onChange={onChangeFromDate}
            />
          </div>
          <div className="account-balance-slide-from-date title">Đến ngày</div>
          <div className="account-balance-slide-from-date">
            <div className="account-balance-slide-from-date-input">{toDate}</div>
            <Calendar
              align={EnumCalendarAlign.left}
              pos={EnumCalendarPos.bot}
              onChange={onChangeToDate}
            />
          </div>
          <div className="account-balance-slide-from-date title">Chọn nhanh</div>
          <div className="account-balance-slide-from-date btn">
            <div
              className="account-balance-radio-btn"
              onClick={() => {
                setDateType(EnumDateType.Tuan);
                onChangeDateType(EnumDateType.Tuan);
              }}
            >
              <input type="radio" checked={dateType == EnumDateType.Tuan} />
              <span style={{ marginLeft: 5 }}>Tuần</span>
            </div>
            <div
              className="account-balance-radio-btn"
              onClick={() => {
                setDateType(EnumDateType.Thang);
                onChangeDateType(EnumDateType.Thang);
              }}
            >
              <input type="radio" checked={dateType == EnumDateType.Thang} />
              <span style={{ marginLeft: 5 }}>Tháng</span>
            </div>
            <div
              className="account-balance-radio-btn"
              onClick={() => {
                setDateType(EnumDateType.Quy);
                onChangeDateType(EnumDateType.Quy);
              }}
            >
              <input type="radio" checked={dateType == EnumDateType.Quy} />
              <span style={{ marginLeft: 5 }}>Quý</span>
            </div>
            <div
              className="account-balance-radio-btn"
              onClick={() => {
                setDateType(EnumDateType.Nam);
                onChangeDateType(EnumDateType.Nam);
              }}
            >
              <input type="radio" checked={dateType == EnumDateType.Nam} />
              <span style={{ marginLeft: 5 }}>Năm</span>
            </div>
          </div>
          <div className="account-balance-slide-from-date">
            {dateType == EnumDateType.Thang ? (
              <div className="account-balance-select-component">
                <span style={{ marginRight: 10 }}>Tháng</span>
                <select
                  value={month}
                  onChange={(event) => {
                    setMonth(event.target.value);
                    onChangeToMonthType(Number(event.target.value), year);
                  }}
                >
                  {elmThang.length > 0 ? elmThang : null}
                </select>
              </div>
            ) : dateType == EnumDateType.Quy ? (
              <div className="account-balance-select-component">
                <span style={{ marginRight: 10 }}>Quý</span>
                <select
                  value={quarter}
                  onChange={(event) => {
                    setQuarter(event.target.value);
                    onChangeToQuarterType(Number(event.target.value), year);
                  }}
                >
                  {elmQuy.length > 0 ? elmQuy : null}
                </select>
              </div>
            ) : dateType == EnumDateType.Tuan ? (
              <div className="account-balance-select-component">
                <span style={{ marginRight: 10 }}>Tuần</span>
                <select
                  value={week}
                  onChange={(event) => {
                    setWeek(event.target.value);
                    onChangeToWeekType(Number(event.target.value), year);
                  }}
                >
                  {elmTuan.length > 0 ? elmTuan : null}
                </select>
              </div>
            ) : null}
            <div className="account-balance-select-component">
              <span style={{ marginRight: 10 }}>Năm</span>
              <select
                value={year}
                onChange={(event) => {
                  setYear(event.target.value);
                  if (dateType == EnumDateType.Tuan) {
                    onChangeToWeekType(week, Number(event.target.value));
                  } else if (dateType == EnumDateType.Thang) {
                    onChangeToMonthType(month, Number(event.target.value));
                  } else if (dateType == EnumDateType.Quy) {
                    onChangeToQuarterType(quarter, Number(event.target.value));
                  } else if (dateType == EnumDateType.Nam) {
                    onChantoYearType(Number(event.target.value));
                  }
                }}
              >
                {elmNam.length > 0 ? elmNam : null}
              </select>
            </div>
          </div>
          <div className="account-balance-slide-from-date title">CTV {name}</div>
        </div>
        <div className="account-balance-main-container">
          <div className="account-balance-main-component">
            {userId != '' ? (
              moneyAmount >= 0 ? (
                <div className="account-balance-main-detail">
                  Số dư tài khoản:{' '}
                  <span style={{ color: 'blue' }}>{toNumberFunction(moneyAmount)}¥</span>
                </div>
              ) : (
                <div className="account-balance-main-detail">
                  Số tiền chưa thanh toán:{' '}
                  <span style={{ color: 'red' }}>{toNumberFunction(moneyAmount)}¥</span>
                </div>
              )
            ) : null}
          </div>
          {/* <ToolBar
            toolbarName={'Chi tiết'}
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
          <div className="account-balance-sim-order-detail">
            {/* <Table
              key={'table sim'}
              header={header}
              tableType={'label'}
              isDisable={true}
              data={accountBalanceHistoryList}
              onRightMouseClick={onRightMouseClick}
              displayList={displayList}
              manage={'.accountHistoryId'}
              typeList={typeList}
              onDoubleClick={onDoubleClick}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountBalance;
