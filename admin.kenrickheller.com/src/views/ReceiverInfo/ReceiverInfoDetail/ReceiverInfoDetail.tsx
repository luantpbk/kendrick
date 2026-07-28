/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useGetShipInfoByZipcode } from 'src/api/commonInfomationApi';
import { ProfileInfo, ReceiverInfoType } from 'src/api/models';
import { useGetQRCode } from 'src/api/qrApi';
import {
  useGetReceiverInfoById,
  usePostReceiverInfo,
  usePutReceiverInfo,
} from 'src/api/receiverInfoApi';
import { useGetUserList } from 'src/api/userApi';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import { normalizationZipcode } from 'src/utils/stringUtils';
import './ReceiverInfoDetail.css';

export enum EnumConfigReceiverInfoDetail {
  add = 1,
  edit = 2,
  view = 3,
}

interface IReceiverInfoDetail {
  receiverInfoId?: number;
  config: EnumConfigReceiverInfoDetail;
}

const ReceiverInfoDetai: React.FC<IReceiverInfoDetail> = (props) => {
  //Value
  const config = props.config;
  const receiverInfoId = props.receiverInfoId;

  //State
  const [userId, setUserId] = useState<number>(null);
  const [userIdError, setUserIdError] = useState(null);

  const [fullName, setFullName] = useState(undefined);
  const [fullNameError, setFullNameError] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState(undefined);

  const [zipCode, setZipCode] = useState(undefined);
  const [zipCodeError, setZipCodeError] = useState(null);

  const [address1, setAddress1] = useState(undefined);
  const [address2, setAddress2] = useState(undefined);
  const [address3, setAddress3] = useState(undefined);
  const [address4, setAddress4] = useState(undefined);
  const [addressError, setAddressError] = useState(null);

  const [facebook, setFacebook] = useState(null);
  const [zalo, setZalo] = useState(null);

  const [focusInput, setFocusInput] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [keyword, setKeyword] = useState(undefined);
  const [isShowUserList, setIsShowUserList] = useState(false);
  const [userList, setUserList] = useState<ProfileInfo[]>(null);
  //End of state

  //Function
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();
  const getReceiverInfoById = useGetReceiverInfoById();
  const postReceiverInfo = usePostReceiverInfo();
  const putReceiverInfo = usePutReceiverInfo();
  const addPopup = useAddPopup();
  const getUserList = useGetUserList();

  const getShipInfoByZipcode = useGetShipInfoByZipcode();

  //Validate

  const validateFullName = () => {
    let isContinue = true;

    if (!fullName || fullName == '') {
      isContinue = false;
      setFullNameError('Chưa nhập tên người nhận hàng');
    } else setFullNameError(null);

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

  const validateZipCode = () => {
    let isContinue = true;

    if (!zipCode || zipCode == '') {
      isContinue = false;
      setZipCodeError('Chưa nhập mã bưu điện');
    } else setZipCodeError(null);

    return isContinue;
  };

  const validateAddress = () => {
    let isContinue = true;

    if (
      (!address1 || address1 == '') &&
      (!address2 || address2 == '') &&
      (!address3 || address3 == '') &&
      (!address4 || address4 == '')
    ) {
      isContinue = false;
      setAddressError('Chưa nhập địa chỉ');
    } else setAddressError(null);

    return isContinue;
  };

  const onPostReceiverInfo = () => {
    const isFullName = validateFullName();
    const isZipCode = validateZipCode();
    const isAddress = validateAddress();
    const isUserId = validateUserId();
    if (isFullName && isZipCode && isAddress && isUserId) {
      const receiverInfo: ReceiverInfoType = {
        userId: userId,
        fullname: fullName,
        phoneNumber: phoneNumber,
        zipCode: zipCode,
        address1: address1,
        address2: address2,
        address3: address3,
        address4: address4,
        facebook: facebook,
        zalo: zalo,
      };
      postReceiverInfo(receiverInfo)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Thêm địa chỉ nhận hàng thành công',
            },
          });
          
          
          reloadTable();
        })
        .catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
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

  const onPutReceiverInfo = () => {
    const isFullName = validateFullName();
    const isZipCode = validateZipCode();
    const isAddress = validateAddress();
    const isUserId = validateUserId();
    if (isFullName && isZipCode && isAddress && isUserId && receiverInfoId) {
      const receiverInfo: ReceiverInfoType = {
        userId: userId,
        fullname: fullName,
        phoneNumber: phoneNumber,
        zipCode: zipCode,
        address1: address1,
        address2: address2,
        address3: address3,
        address4: address4,
        facebook: facebook,
        zalo: zalo,
        receiverInfoId: receiverInfoId,
      };
      putReceiverInfo(receiverInfo)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa địa chỉ nhận hàng thành công',
            },
          });
          
          
          reloadTable();
        })
        .catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
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
  //100
  const keywordInput = () => {
    return (
      <>
        <div
          className={`sim-input ${focusInput == 100 ? 'focus-input' : ''} ${
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
              setFocusInput(100);
              setIsShowUserList(true);
            }}
            onBlur={() => {
              validateUserId();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 100}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //1
  const fullNameInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            fullName ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Tên người nhận hàng</div>
          <input
            type="text"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateFullName();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{fullNameError}</div>
      </>
    );
  };

  //2
  const phoneNumberInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            phoneNumber ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Số điện thoại người nhận</div>
          <input
            type="text"
            value={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 2}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  const getQRCode = useGetQRCode();
  const onShowQRCode = (url: string) => {
    getQRCode({
      content: url,
    })
      .then((blob: Blob) => {
        console.log(blob);
        addPopup({
          // view: {
          //   title: 'QR Code',
          //   isManualRemove: true,
          //   data: (
          //     <div className="qr-popup">
          //       <img src={URL.createObjectURL(blob)} />
          //     </div>
          //   ),
          //   isContext: false,
          // },
        });
      })
      .catch((error) => {
        addPopup({
          error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
        });
      });
  };

  const openLink = (url: string) => {
    window.open(url);
  };

  //3
  const zaloInput = () => {
    return (
      <div>
        <div
          className={`add-order-input ${focusInput == 3 ? 'focus-input' : ''} ${
            zalo ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Zalo</div>
          <input
            className="zalo-text"
            type="text"
            value={zalo}
            onChange={(event) => {
              setZalo(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(3);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
            disabled={isDisable}
          />
          <div className="i-tooltip qr-scan">
            <span className="material-icons qr-scan-icon" onClick={() => onShowQRCode(zalo)}>
              qr_code
            </span>
            <span className="tooltiptext">Hiển thị QRCode thông tin Zalo</span>
          </div>
          <div className="i-tooltip guide">
            <span className="material-icons info-guide" onClick={() => openLink(zalo)}>
              launch
            </span>
            <span className="tooltiptext">Truy cập Zalo</span>
          </div>
        </div>
      </div>
    );
  };

  //4
  const facebookInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 4 ? 'focus-input' : ''} ${
            facebook ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Fb, link fb</div>
          <input
            className="facebook-text"
            type="text"
            value={facebook}
            onChange={(event) => {
              setFacebook(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(4);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 4}
            disabled={isDisable}
          />
          <div className="i-tooltip guide">
            <span className="material-icons info-guide" onClick={() => openLink(facebook)}>
              launch
            </span>
            <span className="tooltiptext">Truy cập Facebook</span>
          </div>
        </div>
      </>
    );
  };

  //5
  const zipCodeInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 5 ? 'focus-input' : ''} ${
            zipCode ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Mã bưu điện</div>
          <input
            type="text"
            value={zipCode}
            onChange={(event) => {
              setZipCode(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(5);
            }}
            onBlur={() => {
              validateZipCode();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 5}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{zipCodeError}</div>
      </>
    );
  };

  //5
  const address1Input = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 5 ? 'focus-input' : ''} ${
            address1 ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Địa chỉ dòng 1</div>
          <input
            type="text"
            value={address1}
            onChange={(event) => {
              setAddress1(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(5);
            }}
            onBlur={() => {
              validateAddress();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 5}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //6
  const address2Input = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 6 ? 'focus-input' : ''} ${
            address2 ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Địa chỉ dòng 2</div>
          <input
            type="text"
            value={address2}
            onChange={(event) => {
              setAddress2(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(6);
            }}
            onBlur={() => {
              validateAddress();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 6}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //7
  const address3Input = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 7 ? 'focus-input' : ''} ${
            address3 ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Địa chỉ dòng 3</div>
          <input
            type="text"
            value={address3}
            onChange={(event) => {
              setAddress3(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(7);
            }}
            onBlur={() => {
              validateAddress();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 7}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //8
  const address4Input = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 8 ? 'focus-input' : ''} ${
            address4 ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Địa chỉ dòng 4</div>
          <input
            type="text"
            value={address4}
            onChange={(event) => {
              setAddress4(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(8);
            }}
            onBlur={() => {
              validateAddress();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 8}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{addressError}</div>
      </>
    );
  };

  const btnComponent = () => {
    if (config == EnumConfigReceiverInfoDetail.add) {
      return (
        <div
          className="add-order-btn"
          onClick={() => {
            onPostReceiverInfo();
          }}
        ></div>
      );
    } else if (config == EnumConfigReceiverInfoDetail.edit) {
      return (
        <div
          className="edit-order-btn"
          onClick={() => {
            onPutReceiverInfo();
          }}
        ></div>
      );
    }
  };
  //End of component

  //useEffect
  useEffect(() => {
    if (config == EnumConfigReceiverInfoDetail.view) {
      setIsDisable(true);
    }
  }, []);

  useEffect(() => {
    if (receiverInfoId) {
      getReceiverInfoById(receiverInfoId)
        .then((data) => {
          setFullName(data.fullname);
          setPhoneNumber(data.phoneNumber);
          setAddress1(data.address1);
          setAddress2(data.address2);
          setAddress3(data.address3);
          setAddress4(data.address4);
          setZipCode(data.zipCode);
          setUserId(data.userId);
          setFacebook(data.facebook);
          setZalo(data.zalo);
          // setKeyword(data.userName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [receiverInfoId]);

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
  }, [keyword, userId]);

  useEffect(() => {
    const nZipcode = normalizationZipcode(zipCode);
    if (!nZipcode || nZipcode.length != 7) return;
    getShipInfoByZipcode(zipCode)
      .then((data) => {
        setAddress1(data?.pref);
        setAddress2(data?.city);
        setAddress3(data?.town);
      })
      .catch(() => {
        setAddress1(undefined);
        setAddress2(undefined);
        setAddress3(undefined);
      });
  }, [zipCode]);

  //Main
  return (
    <div className="add-order-container">
      <div className="add-order-form m-2">
        <div className="add-order-title">THÔNG TIN</div>
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
          {fullNameInput()}
          {phoneNumberInput()}
          {zaloInput()}
          {facebookInput()}
        </form>
      </div>
      <div className="add-order-detail-container m-2">
        {zipCodeInput()}
        {address1Input()}
        {address2Input()}
        {address3Input()}
        {address4Input()}
        {btnComponent()}
      </div>
    </div>
  );
};

export default ReceiverInfoDetai;
