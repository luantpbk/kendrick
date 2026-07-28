import React, { useState, useEffect } from 'react';
import { BusinessType, CustomerType, ProfileInfo, UserCustomerType } from 'src/api/models';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import Calendar, { EnumCalendarAlign, EnumCalendarPos } from 'src/components/Calendar/Calendar';
import './UserCustomerTypeDetail.css';
import {
  useGetBusinessTypeList,
  useGetUserCustomerTypeById,
  usePostUserCustomerType,
  usePutUserCustomerType,
} from 'src/api/userCustomerTypeApi';
import { useGetCustomerType } from 'src/api/customerTypeApi';
import { useGetUserList } from 'src/api/userApi';

export enum EnumConfigSimPriceDetail {
  add = 1,
  edit = 2,
  view = 3,
  update = 4,
}

interface ISimPriceDetail {
  config: EnumConfigSimPriceDetail;
  userCustomerTypeId?: number;
}

const UserCustomerTypeDetail: React.FC<ISimPriceDetail> = (props) => {
  //Value
  const config = props.config;
  const userCustomerTypeId = props.userCustomerTypeId;

  //State
  const [userId, setUserId] = useState<number>(null);
  const [userIdError, setUserIdError] = useState(null);

  const [customerTypeId, setCustomerTypeId] = useState(0);
  const [customerTypeIdError, setCustomerTypeIdError] = useState(null);

  const [displayOrder, setDisplayOrder] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);

  const [businessType, setBusinessType] = useState(0);
  const [businessTypeEror, setBusinessTypeError] = useState(null);

  const [customerTypeList, setCustomerTypeList] = useState<CustomerType[]>([]);
  const [businessTypeList, setBusinessTypeList] = useState<BusinessType[]>([]);

  const [keyword, setKeyword] = useState(undefined);
  const [isShowUserList, setIsShowUserList] = useState(false);
  const [userList, setUserList] = useState<ProfileInfo[]>(null);

  const [focusInput, setFocusInput] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  //End of state

  //Function
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();
  const addPopup = useAddPopup();
  const postUserCustomerType = usePostUserCustomerType();
  const putUserCustomerType = usePutUserCustomerType();
  const getUserCustomerTypeById = useGetUserCustomerTypeById();
  const getCustomerType = useGetCustomerType();
  const getUserList = useGetUserList();
  const getBusinessTypeList = useGetBusinessTypeList();

  const onChangeCalendar = (str: string) => {
    setEffectiveDate(str);
  };

  //Validate
  const validateUserId = () => {
    let isContinue = true;

    if (!userId) {
      isContinue = false;
      setUserIdError('Chưa nhập CTV');
    } else setUserIdError(null);

    return isContinue;
  };

  const validateCustomerTypeId = () => {
    let isContinue = true;

    if (!customerTypeId || customerTypeId == 0) {
      isContinue = false;
      setCustomerTypeIdError('Chưa chọn loại khách hàng');
    } else setCustomerTypeIdError(null);

    return isContinue;
  };

  const validateBusinessType = () => {
    let isContinue = true;

    if (!businessType || businessType == 0) {
      isContinue = false;
      setBusinessTypeError('Chưa chọn loại hình kinh doanh');
    } else setBusinessTypeError(null);

    return isContinue;
  };

  const onPostUserCustomerType = () => {
    const isUserId = validateUserId();
    const isCustomerTypeId = validateCustomerTypeId();
    const isBusinessType = validateBusinessType();
    if (isUserId && isCustomerTypeId && isBusinessType) {
      const _temp: UserCustomerType = {
        displayOrder: displayOrder,
        customerTypeId: customerTypeId,
        userId: userId,
        effectiveDate: effectiveDate,
        businessType: businessType,
      };
      postUserCustomerType(_temp)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Thêm bản ghi thành công',
            },
          });
          reloadTable();
          
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

  const onPutUserCustomerType = () => {
    const isUserId = validateUserId();
    const isCustomerTypeId = validateCustomerTypeId();
    const isBusinessType = validateBusinessType();
    if (isUserId && isCustomerTypeId && isBusinessType) {
      const _temp: UserCustomerType = {
        displayOrder: displayOrder,
        userCustomerTypeId: userCustomerTypeId,
        customerTypeId: customerTypeId,
        userId: userId,
        effectiveDate: effectiveDate,
        businessType: businessType,
      };
      putUserCustomerType(_temp)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa bản ghi thành công',
            },
          });
          reloadTable();
          
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

  const onUpdateUserCustomerType = () => {
    const isUserId = validateUserId();
    const isCustomerTypeId = validateCustomerTypeId();
    if (isUserId && isCustomerTypeId) {
      const dateObj = new Date();
      const dd = dateObj.getDate();
      const mm = dateObj.getMonth() + 1;
      const yy = dateObj.getFullYear();
      const _effectiveDate = `${dd}/${mm}/${yy}`;

      const _temp: UserCustomerType = {
        displayOrder: displayOrder,
        customerTypeId: customerTypeId,
        userId: userId,
        effectiveDate: _effectiveDate,
      };
      postUserCustomerType(_temp)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Thêm bản ghi thành công',
            },
          });
          reloadTable();
          
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
  //3
  const effectiveDateInput = () => {
    return (
      <div className="sim-price-detail-calendar">
        <div
          className={`sim-price-detail-input calendar  ${
            effectiveDate ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Ngày hiệu lực</div>
          <input type="text" value={effectiveDate} disabled={true} />
        </div>
        <div className="sim-calendar-container">
          <Calendar
            align={EnumCalendarAlign.right}
            pos={EnumCalendarPos.top}
            onChange={onChangeCalendar}
          />
        </div>
      </div>
    );
  };

  //4
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 3 ? 'focus-input' : ''} ${
            displayOrder ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Thứ tự</div>
          <input
            type="text"
            value={displayOrder}
            onChange={(event) => {
              setDisplayOrder(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(3);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
            disabled={isDisable || config == EnumConfigSimPriceDetail.update}
            placeholder="Nên thêm để quản lý tốt hơn"
          />
        </div>
      </>
    );
  };

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
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  const btnComponent = () => {
    if (config == EnumConfigSimPriceDetail.add) {
      return (
        <div
          className="sim-price-detail-btn"
          onClick={() => {
            onPostUserCustomerType();
          }}
        ></div>
      );
    } else if (config == EnumConfigSimPriceDetail.edit) {
      return (
        <div
          className="edit-order-btn"
          onClick={() => {
            onPutUserCustomerType();
          }}
        ></div>
      );
    } else if (config == EnumConfigSimPriceDetail.update) {
      return (
        <div
          className="edit-order-btn"
          onClick={() => {
            onUpdateUserCustomerType();
          }}
        ></div>
      );
    }
  };

  const custormerTypeOption = () => {
    return (
      <>
        <select
          value={customerTypeId.toString()}
          className="sim-price-detail-option"
          onChange={(event) => {
            if (Number(event.target.value) != 0) {
              setCustomerTypeId(Number(event.target.value));
            }
            event.preventDefault();
          }}
          disabled={isDisable}
        >
          <option value={0}>Loại khách hàng</option>
          {customerTypeList.map((value) => {
            return <option value={value.customerTypeId}>{value.customerTypeTitle}</option>;
          })}
        </select>
        <div style={{ color: 'red', paddingLeft: 2 }}>{customerTypeIdError}</div>
      </>
    );
  };

  const businessTypeOption = () => {
    return (
      <>
        <select
          value={businessType.toString()}
          className="sim-price-detail-option"
          onChange={(event) => {
            if (Number(event.target.value) != 0) {
              setBusinessType(Number(event.target.value));
            }
            event.preventDefault();
          }}
          disabled={isDisable}
        >
          <option value={0}>Loại hình kinh doanh</option>
          {businessTypeList.map((value) => {
            return <option value={value.businessType}>{value.businessTypeTitle}</option>;
          })}
        </select>
        <div style={{ color: 'red', paddingLeft: 2 }}>{businessTypeEror}</div>
      </>
    );
  };
  //End of component

  //useEffect
  useEffect(() => {
    if (config == EnumConfigSimPriceDetail.view) {
      setIsDisable(true);
    }
  }, [config]);

  useEffect(() => {
    getCustomerType()
      .then((data) => {
        setCustomerTypeList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getCustomerType]);

  useEffect(() => {
    if (userCustomerTypeId) {
      getUserCustomerTypeById(userCustomerTypeId)
        .then((data) => {
          setDisplayOrder(data.displayOrder);
          setCustomerTypeId(data.customerTypeId);
          setEffectiveDate(data.effectiveDate);
          setKeyword(data.user.fullName);
          setBusinessType(data.businessType);
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [addPopup, getUserCustomerTypeById, userCustomerTypeId]);

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

  useEffect(() => {
    getBusinessTypeList()
      .then((data) => {
        setBusinessTypeList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getBusinessTypeList]);

  useEffect(() => {
    const date = new Date();
    const dd1 = date.getDate();
    const mm1 = date.getMonth() + 1;
    const yy1 = date.getFullYear();

    const effDate = `${dd1}/${mm1}/${yy1}`;

    setEffectiveDate(effDate);
  }, []);

  //Main
  return (
    <div className="sim-price-detail-container">
      <div className="sim-price-detail-form">
        <form className="sim-price-detail-from-component">
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
          {custormerTypeOption()}
          {businessTypeOption()}
          {displayOrderInput()}
          {config == EnumConfigSimPriceDetail.add || config == EnumConfigSimPriceDetail.edit
            ? effectiveDateInput()
            : null}
        </form>
      </div>
      <div>{btnComponent()}</div>
    </div>
  );
};

export default UserCustomerTypeDetail;
