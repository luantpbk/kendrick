import React, { useState } from 'react';
import { useAddMoneyWallet, useDeductMoneyWallet } from 'src/api/accountBalanceApi';
import { AccountBalanceMoneyType } from 'src/api/models';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import './AccountBalanceMoney.css';

export enum EnumConfigAccountBalanceDetail {
  add = 1,
  deduct = 2,
}

interface ISimOrderDetail {
  config: EnumConfigAccountBalanceDetail;
  userId: number;
}

const AccountBalanceMoney: React.FC<ISimOrderDetail> = (props) => {
  //Value
  const config = props.config;

  //State
  const [moneyAmount, setMoneyAmount] = useState(undefined);
  const [moneyAmountError, setMoneyAmountError] = useState(null);

  const [note, setNote] = useState(undefined);
  const [noteError, setNoteError] = useState(undefined);

  const [focusInput, setFocusInput] = useState(null);
  //End of state

  //Function
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();

  const addPopup = useAddPopup();
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

  const validateNote = () => {
    let isContinue = true;

    if (!note || note == '') {
      isContinue = false;
      setNoteError('Chưa nhập nội dung');
    } else setNoteError(null);

    return isContinue;
  };

  const onAddMoney = () => {
    const isMoneyAmount = validateMoneyAmount();
    const isNote = validateNote();

    if (isMoneyAmount && isNote) {
      const data: AccountBalanceMoneyType = {
        userId: props.userId,
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
    const isMoneyAmount = validateMoneyAmount();
    const isNote = validateNote();

    if (isMoneyAmount && isNote) {
      const data: AccountBalanceMoneyType = {
        userId: props.userId,
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
              validateNote();
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

  //Main
  return (
    <div className="add-order-container">
      <div className="add-order-form m-2">
        <form>
          {moneyAmountInput()}
          {noteInput()}
        </form>
      </div>
      {btnComponent()}
    </div>
  );
};

export default AccountBalanceMoney;
