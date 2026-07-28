import React, { useState, useEffect } from 'react';
import { StoreType } from 'src/api/models';
import { useGetStoreById, usePostStore, usePutStore } from 'src/api/storeApi';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import './StoreDetail.css';

export enum EnumIStoreDetailConfig {
  add = 1,
  edit = 2,
  view = 3,
}

interface IStoreDetail {
  config: EnumIStoreDetailConfig;
  storeId?: number;
}

const StoreDetail: React.FC<IStoreDetail> = (props) => {
  //State
  const [storeCode, setStoreCode] = useState(null);
  const [storeCodeError, setStoreCodeError] = useState(null);

  const [storeTitle, setStoreTitle] = useState(null);

  const [longitude, setLongitude] = useState(null);
  const [longitudeError, setLongitudeError] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [latitudeError, setLatitudeError] = useState(null);

  const [focusInput, setFocusInput] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  //End of state

  //Function
  const postStore = usePostStore();
  const putStore = usePutStore();
  const getStoreById = useGetStoreById();

  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();
  const addPopup = useAddPopup();

  //Validate
  const validateStoreCode = () => {
    let isContinue = true;

    if (!storeCode || storeCode == '') {
      isContinue = false;
      setStoreCodeError('Chưa nhập mã nhà kho');
    } else setStoreCodeError(null);

    return isContinue;
  };

  const validateLongitude = () => {
    let isContinue = true;

    if (!longitude || longitude == '') {
      isContinue = false;
      setLongitudeError('Chưa nhập kinh độ');
    } else setLongitudeError(null);

    return isContinue;
  };

  const validateLatitude = () => {
    let isContinue = true;

    if (!latitude || latitude == '') {
      isContinue = false;
      setLatitudeError('Chưa nhập vĩ độ');
    } else setLatitudeError(null);

    return isContinue;
  };

  const onPostStore = () => {
    const isStoreCode = validateStoreCode();
    const isLongitude = validateLongitude();
    const isLatitude = validateLatitude();
    if (isStoreCode && isLongitude && isLatitude) {
      const store: StoreType = {
        storeCode: storeCode,
        storeTitle: storeTitle,
        longitude: longitude,
        latitude: latitude,
      };
      postStore(store)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Thêm địa chỉ kho thành công',
            },
          });
          
          
          reloadTable();
        })
        .catch((error) => {
          console.log(error);
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

  const onPutStore = () => {
    const isStoreCode = validateStoreCode();
    const isLongitude = validateLongitude();
    const isLatitude = validateLatitude();
    if (isStoreCode && isLongitude && isLatitude && props.storeId) {
      const store: StoreType = {
        storeCode: storeCode,
        storeTitle: storeTitle,
        longitude: longitude,
        latitude: latitude,
        storeId: props.storeId,
      };
      putStore(store)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa địa chỉ kho thành công',
            },
          });
          
          
          reloadTable();
        })
        .catch((error) => {
          console.log(error);
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
  //1
  const storeCodeInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            storeCode ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Mã nhà kho</div>
          <input
            type="text"
            value={storeCode}
            onChange={(event) => {
              setStoreCode(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateStoreCode();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{storeCodeError}</div>
      </>
    );
  };

  //2
  const storeTitleInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            storeTitle ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Mô tả</div>
          <input
            type="text"
            value={storeTitle}
            onChange={(event) => {
              setStoreTitle(event.target.value);
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

  //3
  const longitudeInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 3 ? 'focus-input' : ''} ${
            longitude ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Kinh độ</div>
          <input
            type="text"
            value={longitude}
            onChange={(event) => {
              setLongitude(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(3);
            }}
            onBlur={() => {
              validateLongitude();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{longitudeError}</div>
      </>
    );
  };

  //4
  const latitudeInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 4 ? 'focus-input' : ''} ${
            latitude ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Vĩ độ</div>
          <input
            type="text"
            value={latitude}
            onChange={(event) => {
              setLatitude(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(4);
            }}
            onBlur={() => {
              validateLatitude();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 4}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{latitudeError}</div>
      </>
    );
  };

  const btnComponent = () => {
    return props.config == EnumIStoreDetailConfig.add ? (
      <div
        className="add-order-btn"
        onClick={() => {
          onPostStore();
        }}
      ></div>
    ) : props.config == EnumIStoreDetailConfig.edit ? (
      <div
        className="edit-order-btn"
        onClick={() => {
          onPutStore();
        }}
      ></div>
    ) : null;
  };
  //End of component

  useEffect(() => {
    if (props.storeId) {
      getStoreById(props.storeId)
        .then((data) => {
          setStoreCode(data.storeCode);
          setStoreTitle(data.storeTitle);
          setLongitude(data.longitude);
          setLatitude(data.latitude);
        })
        .catch((error) => {
          console.log(error);
          console.log('store detail error');
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [addPopup, getStoreById, props.storeId]);

  useEffect(() => {
    if (props.config == EnumIStoreDetailConfig.view) {
      setIsDisable(true);
    }
  }, [props.config]);

  //Main
  return (
    <div className="add-order-container">
      <div className="add-order-form m-2">
        <form>
          {storeCodeInput()}
          {storeTitleInput()}
          {longitudeInput()}
          {latitudeInput()}
        </form>
        {btnComponent()}
      </div>
    </div>
  );
};

export default StoreDetail;
