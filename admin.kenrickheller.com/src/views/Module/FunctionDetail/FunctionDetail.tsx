import React, { useState, useEffect } from 'react';
import { useGetFunctionById, usePostFunction, usePutFunction } from 'src/api/functionApi';
import { FunctionType, ModuleType } from 'src/api/models';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import './FunctionDetail.css';

export enum EnumFunctionDetailConfig {
  view = 1,
  add = 2,
  edit = 3,
  change_pass = 4,
}

interface IFunctionDetail {
  config: EnumFunctionDetailConfig;
  functionId?: number;
  moduleId: number;
  reloadFunction: (...args: any[]) => any;
}

const FunctionDetail: React.FC<IFunctionDetail> = (props) => {
  //Value
  const config = props.config;
  const functionId = props.functionId;
  const moduleId = props.moduleId;

  //State
  const [functionName, setFunctionName] = useState(null);
  const [functionNameError, setFunctionNameError] = useState(null);

  const [description, setDescription] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(null);

  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const getFunctionById = useGetFunctionById();
  const postFunction = usePostFunction();
  const putFunction = usePutFunction();

  const onAddFunction = () => {
    const temp: FunctionType = {
      displayOrder: displayOrder,
      functionName: functionName,
      description: description,
      moduleId: moduleId,
    };
    postFunction(temp)
      .then(() => {
       
        addPopup({
          txn: {
            success: true,
            summary: 'Thêm function thành công',
          },
        });
        props.reloadFunction();
      })
      .catch((error) => {
       
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const onEditFunction = () => {
    if (functionId) {
      const temp: FunctionType = {
        displayOrder: displayOrder,
        functionName: functionName,
        description: description,
        moduleId: moduleId,
        functionId: functionId,
      };
      putFunction(temp)
        .then(() => {
         
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa function thành công',
            },
          });
          props.reloadFunction();
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
          summary: 'Đã có lỗi xảy ra',
        },
      });
    }
  };

  //Validate
  const validateFunctionName = () => {
    let isContinue = true;
    if (!functionName || functionName == '') {
      isContinue = false;
      setFunctionNameError('Chưa nhập tên function');
    } else setFunctionNameError(null);
    return isContinue;
  };

  //Component
  //1
  const functionNameInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            functionName ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Function Name</div>
          <input
            type="text"
            value={functionName}
            onChange={(event) => {
              setFunctionName(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateFunctionName();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{functionNameError}</div>
      </>
    );
  };

  //2
  const descriptionInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            description ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Description</div>
          <input
            type="text"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
          />
        </div>
      </>
    );
  };

  //3
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 3 ? 'focus-input' : ''} ${
            displayOrder ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Thứ tự hiển thị</div>
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
          />
        </div>
      </>
    );
  };
  //End of component

  useEffect(() => {
    if (functionId) {
      getFunctionById(functionId)
        .then((data) => {
          setFunctionName(data.functionName);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
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
  }, [addPopup, functionId, getFunctionById]);

  //Main
  return (
    <div className="user-detail-container">
      <div className="user-detai-input">
        <form>
          {functionNameInput()}
          {descriptionInput()}
          {displayOrderInput()}
        </form>
      </div>
      <div className="module-detail-btn-container">
        {config == EnumFunctionDetailConfig.add ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onAddFunction();
            }}
          >
            Thêm
          </div>
        ) : config == EnumFunctionDetailConfig.edit ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onEditFunction();
            }}
          >
            Sửa
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FunctionDetail;
