import React, { useState, useEffect } from 'react';
import { useGetApiById, usePostApi, usePutApi } from 'src/api/apiServiceApi';
import { ApiType, EnumActionType, EnumHttpMethod, ModuleType } from 'src/api/models';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import './ApiDetail.css';

export enum EnumApiDetailConfig {
  view = 1,
  add = 2,
  edit = 3,
  change_pass = 4,
}

interface IApiDetail {
  config: EnumApiDetailConfig;
  apiId?: number;
  reloadFunction: (...args: any[]) => any;
}

const ApiDetail: React.FC<IApiDetail> = (props) => {
  //Value
  const config = props.config;
  const apiId = props.apiId;

  //State
  const [router, setRouter] = useState(null);
  const [routerError, setRouterError] = useState(null);

  const [methodId, setMethodId] = useState(EnumHttpMethod.GET);
  const [actionTypeId, setActionTypeId] = useState(EnumActionType.View);
  const [displayOrder, setDisplayOrder] = useState(null);
  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const postApi = usePostApi();
  const putApi = usePutApi();
  const getApiById = useGetApiById();

  const onAddApi = () => {
    const temp: ApiType = {
      displayOrder: displayOrder,
      actionTypeId: actionTypeId,
      methodId: methodId,
      router: router,
    };
    postApi(temp)
      .then(() => {
       
        addPopup({
          txn: {
            success: true,
            summary: 'Thêm api thành công',
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

  const onEditApi = () => {
    if (apiId) {
      const temp: ApiType = {
        displayOrder: displayOrder,
        actionTypeId: actionTypeId,
        methodId: methodId,
        router: router,
        apiId: apiId,
      };
      putApi(temp)
        .then(() => {
         
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa api thành công',
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
  const validateRouter = () => {
    let isContinue = true;
    if (!router || router == '') {
      isContinue = false;
      setRouterError('Chưa nhập router');
    } else setRouterError(null);
    return isContinue;
  };

  //Component
  //1
  const routerInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            router ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Router</div>
          <input
            type="text"
            value={router}
            onChange={(event) => {
              setRouter(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateRouter();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{routerError}</div>
      </>
    );
  };

  //2
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            displayOrder ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">DisplayOrder</div>
          <input
            type="text"
            value={displayOrder}
            onChange={(event) => {
              setDisplayOrder(event.target.value);
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
      </>
    );
  };

  const actionOption = () => {
    return (
      <select
        value={actionTypeId}
        className="sim-option"
        onChange={(event) => {
          setActionTypeId(Number(event.target.value));
          event.preventDefault();
        }}
      >
        <option value={EnumActionType.View}>View</option>
        <option value={EnumActionType.Add}>Add</option>
        <option value={EnumActionType.Edit}>Edit</option>
        <option value={EnumActionType.Delete}>Delete</option>
        <option value={EnumActionType.Confirm}>Confirm</option>
      </select>
    );
  };

  const methodOption = () => {
    return (
      <select
        value={methodId}
        className="sim-option"
        onChange={(event) => {
          setMethodId(Number(event.target.value));
          event.preventDefault();
        }}
      >
        <option value={EnumHttpMethod.GET}>GET</option>
        <option value={EnumHttpMethod.POST}>POST</option>
        <option value={EnumHttpMethod.PUT}>PUT</option>
        <option value={EnumHttpMethod.DELETE}>DELETE</option>
      </select>
    );
  };
  //End of component

  useEffect(() => {
    if (apiId) {
      getApiById(apiId)
        .then((data) => {
          setDisplayOrder(data.displayOrder);
          setRouter(data.router);
          setActionTypeId(data.actionTypeId);
          setMethodId(data.methodId);
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
  }, [addPopup, apiId, getApiById]);

  //Main
  return (
    <div className="user-detail-container">
      <div className="user-detai-input api">
        <form>
          {routerInput()}
          {displayOrderInput()}
          {actionOption()}
          {methodOption()}
        </form>
      </div>
      <div className="module-detail-btn-container">
        {config == EnumApiDetailConfig.add ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onAddApi();
            }}
          >
            Thêm
          </div>
        ) : config == EnumApiDetailConfig.edit ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onEditApi();
            }}
          >
            Sửa
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApiDetail;
