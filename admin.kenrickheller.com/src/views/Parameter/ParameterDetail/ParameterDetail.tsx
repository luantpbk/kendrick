import React, { useState, useEffect } from 'react';
import { ParameterEnumType, ParameterType } from 'src/api/models';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import Calendar, { EnumCalendarAlign, EnumCalendarPos } from 'src/components/Calendar/Calendar';
import './ParameterDetail.css';
import {
  useGetParameterById,
  useGetParameterEnum,
  usePostParameter,
  usePutParameter,
} from 'src/api/parameterApi';

export enum EnumConfigSimPriceDetail {
  add = 1,
  edit = 2,
  view = 3,
  update = 4,
}

interface ISimPriceDetail {
  config: EnumConfigSimPriceDetail;
  parameterId?: number;
}

const ParameterDetail: React.FC<ISimPriceDetail> = (props) => {
  //Value
  const config = props.config;
  const parameterId = props.parameterId;

  //State
  const [parameterTitle, setParameterTitle] = useState(null);
  const [parameterKey, setParameterKey] = useState(null);
  const [parameterValue, setParameterValue] = useState(null);

  const [displayOrder, setDisplayOrder] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);

  const [enumList, setEnumList] = useState<ParameterEnumType[]>(null);
  const [focusInput, setFocusInput] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  //End of state

  //Function
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();
  const getParameterEnum = useGetParameterEnum();
  const postParameter = usePostParameter();
  const putParameter = usePutParameter();
  const addPopup = useAddPopup();
  const getParameterById = useGetParameterById();

  const onChange = (key: string) => {
    if (enumList) {
      enumList.map((value) => {
        if (value.parameterKey == key) {
          setParameterKey(value.parameterKey);
          setParameterTitle(value.parameterTitle);
        }
      });
    }
  };

  const onChangeCalendar = (str: string) => {
    setEffectiveDate(str);
  };

  const onPostParameter = () => {
    if (parameterTitle && parameterValue && parameterKey) {
      const _temp: ParameterType = {
        displayOrder: displayOrder,
        parameterTitle: parameterTitle,
        parameterKey: parameterKey,
        parameterValue: parameterValue,
        effectiveDate: effectiveDate,
      };
      postParameter(_temp)
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

  const onPutParameter = () => {
    if (parameterTitle && parameterValue && parameterKey && parameterId) {
      const _temp: ParameterType = {
        parameterId: parameterId,
        displayOrder: displayOrder,
        parameterTitle: parameterTitle,
        parameterKey: parameterKey,
        parameterValue: parameterValue,
        effectiveDate: effectiveDate,
      };
      putParameter(_temp)
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

  const onUpdateSimPrice = () => {
    if (parameterTitle && parameterValue && parameterKey && parameterId) {
      const dateObj = new Date();
      const dd = dateObj.getDate();
      const mm = dateObj.getMonth() + 1;
      const yy = dateObj.getFullYear();
      const _effectiveDate = `${dd}/${mm}/${yy}`;

      const _temp: ParameterType = {
        displayOrder: displayOrder,
        parameterTitle: parameterTitle,
        parameterKey: parameterKey,
        parameterValue: parameterValue,
        effectiveDate: _effectiveDate,
      };
      postParameter(_temp)
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
  //1
  const titleInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 1 ? 'focus-input' : ''} ${
            parameterTitle ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Tiêu đề</div>
          <input
            type="text"
            value={parameterTitle}
            autoFocus={focusInput == 1}
            disabled={true}
          />
        </div>
      </>
    );
  };

  //2
  const keyInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 2 ? 'focus-input' : ''} ${
            parameterKey ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Key</div>
          <input type="text" value={parameterKey} autoFocus={focusInput == 2} disabled={true} />
        </div>
      </>
    );
  };

  //3
  const valueInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 3 ? 'focus-input' : ''} ${
            parameterValue ? 'validate-input' : ''
          }`}
        >
          <div className="sim-price-detail-input-title">Giá trị</div>
          <input
            type="text"
            value={parameterValue}
            onChange={(event) => {
              setParameterValue(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(3);
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

  //4
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`sim-price-detail-input ${focusInput == 4 ? 'focus-input' : ''} ${
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
              setFocusInput(4);
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

  const btnComponent = () => {
    if (config == EnumConfigSimPriceDetail.add) {
      return (
        <div
          className="sim-price-detail-btn"
          onClick={() => {
            onPostParameter();
          }}
        ></div>
      );
    } else if (config == EnumConfigSimPriceDetail.edit) {
      return (
        <div
          className="edit-order-btn"
          onClick={() => {
            onPutParameter();
          }}
        ></div>
      );
    } else if (config == EnumConfigSimPriceDetail.update) {
      return (
        <div
          className="edit-order-btn"
          onClick={() => {
            onUpdateSimPrice();
          }}
        ></div>
      );
    }
  };

  const parameterEnumOption = () => {
    return enumList ? (
      <select
        value={parameterKey}
        className="sim-price-detail-option"
        onChange={(event) => {
          onChange(event.target.value);
          event.preventDefault();
        }}
        disabled={isDisable || config == EnumConfigSimPriceDetail.update}
      >
        <option value={0}>Chọn thiết lập</option>
        {enumList
          ? enumList.map((value) => {
              return <option value={value.parameterKey}>{value.parameterTitle}</option>;
            })
          : null}
      </select>
    ) : null;
  };
  //End of component

  //useEffect
  useEffect(() => {
    getParameterEnum()
      .then((data) => {
        setEnumList(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getParameterEnum]);

  useEffect(() => {
    if (config == EnumConfigSimPriceDetail.view) {
      setIsDisable(true);
    }
  }, [config]);

  useEffect(() => {
    if (parameterId) {
      getParameterById(parameterId)
        .then((data) => {
          setParameterTitle(data.parameterTitle);
          setParameterValue(data.parameterValue);
          setParameterKey(data.parameterKey);
          setDisplayOrder(data.displayOrder);
          setEffectiveDate(data.effectiveDate);
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
  }, [addPopup, getParameterById, parameterId]);

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
          {parameterEnumOption()}
          {titleInput()}
          {keyInput()}
          {valueInput()}
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

export default ParameterDetail;
