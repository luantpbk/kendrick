import React, { useState, useEffect } from 'react';
import { useAddMoneyWallet, useDeductMoneyWallet } from 'src/api/accountBalanceApi';
import { AccountBalanceMoneyType, ProfileInfo } from 'src/api/models';
import { useGetUserList } from 'src/api/userApi';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import './AccountBalanceDetail.css';

export enum EnumConfigAccountBalanceDetail {
  add = 1,
  deduct = 2,
}

interface ISimOrderDetail {
  config: EnumConfigAccountBalanceDetail;
}

const AccountBalanceDetail: React.FC<ISimOrderDetail> = (props) => {
  //Value
  const config = props.config;

  //State
  const [userId, setUserId] = useState<number>(null);
  const [userIdError, setUserIdError] = useState(null);

  const [moneyAmount, setMoneyAmount] = useState(undefined);
  const [moneyAmountError, setMoneyAmountError] = useState(null);

  const [note, setNote] = useState(undefined);
  const [noteError, setNoteError] = useState(null);

  const [focusInput, setFocusInput] = useState(null);

  const [keyword, setKeyword] = useState(undefined);
  const [isShowUserList, setIsShowUserList] = useState(false);
  const [userList, setUserList] = useState<ProfileInfo[]>(null);
  //End of state

  //Function
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();

  const addPopup = useAddPopup();
  const getUserList = useGetUserList();
  const addMoney = useAddMoneyWallet();
  const deductMoney = useDeductMoneyWallet();

  //Validate
  const validateMoneyAmount = () => {
    let isContinue = true;

    if (!moneyAmount || moneyAmount == '') {
      isContinue = false;
      setMoneyAmountError('Chưa nhập số tiền');
    } else setMoneyAmountError(null);

    return isContinue;
  };

  const validateUserId = () => {
    let isContinue = true;

    if (!userId) {
      isContinue = false;
      setUserIdError('Chưa nhập CTV');
    } else setUserIdError(null);

    return isContinue;
  };

  const validateNote = () => {
    let isContinue = true;

    if (!note || note == '') {
      isContinue = false;
      setNoteError('Chưa nhập nội dung');
    } else setNoteError(null);

    return isContinue;
  };

  const onAddMoney = () => {
    const isUserId = validateUserId();
    const isMoneyAmount = validateMoneyAmount();
    const isNote = validateNote();

    if (isUserId && isMoneyAmount && isNote) {
      const data: AccountBalanceMoneyType = {
        userId: userId,
        moneyAmount: Number(moneyAmount),
        note: note,
      };
      console.log(data);
      addMoney(data)
        .then(() => {
          reloadTable();
         
          addPopup({
            txn: {
              success: true,
              summary: 'Nạp tiền thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    } else {
      addPopup({
        txn: {
          success: false,
          summary: 'Chưa nhập đủ thông tin',
        },
      });
    }
  };

  const onDeductMoney = () => {
    const isUserId = validateUserId();
    const isMoneyAmount = validateMoneyAmount();
    const isNote = validateNote();

    if (isUserId && isMoneyAmount && isNote) {
      const data: AccountBalanceMoneyType = {
        userId: userId,
        moneyAmount: Number(moneyAmount),
        note: note,
      };
      deductMoney(data)
        .then(() => {
          reloadTable();
         
          addPopup({
            txn: {
              success: true,
              summary: 'Trừ tiền thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    } else {
      addPopup({
        txn: {
          success: false,
          summary: 'Chưa nhập đủ thông tin',
        },
      });
    }
  };

  //Component
  //10
  const keywordInput = () => {
    return (
      <>
        <div
          className={`sim-input ${focusInput == 10 ? 'focus-input' : ''} ${
            keyword ? 'validate-input' : ''
          }`}
        >
          <div className="sim-input-title">CTV</div>
          <input
            type="text"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(10);
              setIsShowUserList(true);
            }}
            onBlur={() => {
              validateUserId();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 10}
          />
        </div>
      </>
    );
  };

  //1
  const moneyAmountInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            moneyAmount ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Số tiền</div>
          <input
            type="text"
            value={moneyAmount}
            onChange={(event) => {
              setMoneyAmount(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateMoneyAmount();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{moneyAmountError}</div>
      </>
    );
  };

  //2
  const noteInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            note ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Nội dung</div>
          <input
            type="text"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 2}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{noteError}</div>
      </>
    );
  };

  const btnComponent = () => {
    if (config == EnumConfigAccountBalanceDetail.add) {
      return (
        <div
          className="add-money-btn"
          onClick={() => {
            onAddMoney();
          }}
        ></div>
      );
    } else {
      return (
        <div
          className="deduct-money-btn"
          onClick={() => {
            onDeductMoney();
          }}
        ></div>
      );
    }
  };

  //End of component

  //useEffect

  useEffect(() => {
    if (keyword && keyword !== '') {
      getUserList(keyword)
        .then((data) => {
          setUserList(data.items);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setUserList(null);
    }
  }, [getUserList, keyword, userId]);

  //Main
  return (
    <div className="add-order-container">
      <div className="add-order-form m-2">
        {keywordInput()}
        {isShowUserList ? (
          <div className="user-list">
            {userList
              ? userList.map((value) => {
                  return (
                    <div
                      className="user-item-container"
                      title={value.email}
                      onClick={() => {
                        setUserId(value.userId);
                        setIsShowUserList(false);
                        setKeyword(value.fullName);
                        setUserIdError(null);
                      }}
                    >
                      {value.fullName}
                    </div>
                  );
                })
              : null}
          </div>
        ) : null}
        <div style={{ color: 'red', paddingLeft: 2 }}>{userIdError}</div>
        <form>
          {moneyAmountInput()}
          {noteInput()}
        </form>
      </div>
      {btnComponent()}
    </div>
  );
};

export default AccountBalanceDetail;
