import React, { useState, useEffect } from 'react';
import {
  useGetCustomerTypeById,
  usePostCustomerType,
  usePutCustomerType,
} from 'src/api/customerTypeApi';
import { CustomerType } from 'src/api/models';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import './CustomerTypeDetail.css';

export enum EnumConfigSimPriceDetail {
  add = 1,
  edit = 2,
  view = 3,
  update = 4,
}

interface ISimPriceDetail {
  config: EnumConfigSimPriceDetail;
  customerTypeId?: number;
}

const CustomerTypeDetail: React.FC<ISimPriceDetail> = (props) => {
  //Value
  const config = props.config;
  const customerTypeId = props.customerTypeId;

  //State
  const [customerTypeCode, setCustomerTypeCode] = useState(null);
  const [customerTypeCodeError, setCustomerTypeCodeError] = useState(null);

  const [customerTypeTitle, setCustomerTypeTitle] = useState(null);
  const [customerTypeTitleError, setCustomerTypeTitleError] = useState(null);
  const [feePercent, setFeePercent] = useState(null);
  const [salesTarget, setSalesTarget] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(null);

  const [focusInput, setFocusInput] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  //End of state

  //Function
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();
  const addPopup = useAddPopup();
  const getCustomerTypeById = useGetCustomerTypeById();
  const postCustomerType = usePostCustomerType();
  const putCustomerType = usePutCustomerType();

  //Validate
  const validateCustomerTypeCode = () => {
    let isContinue = true;

    if (!customerTypeCode || customerTypeCode == '') {
      isContinue = false;
      setCustomerTypeCodeError('Chưa nhập code');
    } else setCustomerTypeCodeError(null);

    return isContinue;
  };

  const validateCustomerTypeTitle = () => {
    let isContinue = true;

    if (!customerTypeTitle || customerTypeTitle == '') {
      isContinue = false;
      setCustomerTypeTitleError('Chưa nhập tiêu đề');
    } else setCustomerTypeTitleError(null);

    return isContinue;
  };

  const onPostCustomerType = () => {
    const isCode = validateCustomerTypeCode();
    const isTitle = validateCustomerTypeTitle();
    if (isCode && isTitle) {
      console.log(customerTypeTitle);
      const _temp: CustomerType = {
        displayOrder: displayOrder,
        customerTypeCode: customerTypeCode,
        customerTypeTitle: customerTypeTitle,
        feePercent: feePercent,
        salesTarget: salesTarget,
        discountPercent: discountPercent,
      };
      postCustomerType(_temp)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Thêm loại khách hàng thành công',
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

  const onPutCustomerType = () => {
    const isCode = validateCustomerTypeCode();
    const isTitle = validateCustomerTypeTitle();
    if (isCode && isTitle) {
      const _temp: CustomerType = {
        customerTypeId: customerTypeId,
        displayOrder: displayOrder,
        customerTypeCode: customerTypeCode,
        customerTypeTitle: customerTypeTitle,
        feePercent: feePercent,
        salesTarget: salesTarget,
        discountPercent: discountPercent,
      };
      putCustomerType(_temp)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa loại khách hàng thành công',
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
  //1
  const customerTypeCodeInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 1 ? 'focus-input' : ''} ${
            customerTypeCode ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Code</div>
          <input
            type="text"
            value={customerTypeCode}
            onChange={(event) => {
              setCustomerTypeCode(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateCustomerTypeCode();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{customerTypeCodeError}</div>
      </>
    );
  };

  //2
  const customerTypeTilteInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 2 ? 'focus-input' : ''} ${
            customerTypeTitle ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Tiêu đề</div>
          <input
            type="text"
            value={customerTypeTitle}
            onChange={(event) => {
              setCustomerTypeTitle(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              setFocusInput(null);
              validateCustomerTypeTitle();
            }}
            autoFocus={focusInput == 2}
            disabled={isDisable}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{customerTypeTitleError}</div>
      </>
    );
  };

  //3
  const feePercentInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 3 ? 'focus-input' : ''} ${
            feePercent ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Phí đặt hàng (%)</div>
          <input
            type="text"
            value={feePercent}
            onChange={(event) => {
              setFeePercent(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(3);
            }}
            onBlur={() => {
              setFocusInput(null);
              validateCustomerTypeTitle();
            }}
            autoFocus={focusInput == 3}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //4
  const salesTargetInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 4 ? 'focus-input' : ''} ${
            salesTarget ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Doanh số mục tiêu</div>
          <input
            type="text"
            value={salesTarget}
            onChange={(event) => {
              setSalesTarget(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(4);
            }}
            onBlur={() => {
              setFocusInput(null);
              validateCustomerTypeTitle();
            }}
            autoFocus={focusInput == 4}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //5
  const discountPercentInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 5 ? 'focus-input' : ''} ${
            discountPercent ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Tỷ lệ hoa hồng</div>
          <input
            type="text"
            value={discountPercent}
            onChange={(event) => {
              setDiscountPercent(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(5);
            }}
            onBlur={() => {
              setFocusInput(null);
              validateCustomerTypeTitle();
            }}
            autoFocus={focusInput == 5}
            disabled={isDisable}
          />
        </div>
      </>
    );
  };

  //6
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 6 ? 'focus-input' : ''} ${
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
              setFocusInput(6);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 6}
            disabled={isDisable || config == EnumConfigSimPriceDetail.update}
            placeholder="Nên thêm để quản lý tốt hơn"
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
            onPostCustomerType();
          }}
        ></div>
      );
    } else if (config == EnumConfigSimPriceDetail.edit) {
      return (
        <div
          className="edit-order-btn"
          onClick={() => {
            onPutCustomerType();
          }}
        ></div>
      );
    }
  };
  //End of component

  //useEffect
  useEffect(() => {
    if (config == EnumConfigSimPriceDetail.view) {
      setIsDisable(true);
    }
  }, [config]);

  useEffect(() => {
    if (customerTypeId) {
      getCustomerTypeById(customerTypeId)
        .then((data) => {
          setCustomerTypeCode(data.customerTypeCode);
          setCustomerTypeTitle(data.customerTypeTitle);
          setDisplayOrder(data.displayOrder);
          setDiscountPercent(data.discountPercent);
          setFeePercent(data.feePercent);
          setSalesTarget(data.salesTarget);
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
  }, [addPopup, getCustomerTypeById, customerTypeId]);

  //Main
  return (
    <div className="sim-price-detail-container">
      <div className="sim-price-detail-form">
        <form className="sim-price-detail-from-component">
          {customerTypeCodeInput()}
          {customerTypeTilteInput()}
          {feePercentInput()}
          {salesTargetInput()}
          {discountPercentInput()}
          {displayOrderInput()}
        </form>
      </div>
      <div>{btnComponent()}</div>
    </div>
  );
};

export default CustomerTypeDetail;
