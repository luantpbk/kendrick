import './ApiScreen.css';
import { useState } from 'react';
import React from 'react';
import { useEffect } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import {
  ApiType,
  EnumAction,
  EnumActionType,
  EnumHttpMethod,
  EventButton,
  FunctionType,
} from 'src/api/models';
import { LEFT_MOUSE_BUTTON } from 'src/common/constant/Constant';
import {
  useDeleteApi,
  useGetApi,
  useGetFunctionByApiId,
  useRemoveFunction,
} from 'src/api/apiServiceApi';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';

const ApiScreen: React.FC = () => {
  //State
  const [focusApi, setFocusApi] = useState(null);
  const [apiList, setApiList] = useState<ApiType[]>(null);
  const [functionList, setFunctionList] = useState<FunctionType[]>(null);
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const addPopup = useAddPopup();
  const getApi = useGetApi();
  const deleteApi = useDeleteApi();
  const getFunctionByApiId = useGetFunctionByApiId();
  const removeFunction = useRemoveFunction();
  const confirmModal = useModal(ConfirmModal);

  const reloadFunction = () => {
    setReloadFlag(!reloadFlag);
  };

  const onDeleteApi = (apiId: number) => {
    const onConfirm = () => {
      deleteApi(Number(apiId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa api thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
        })
        .finally(() => reloadFunction());
    };

    const listButton: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: onConfirm,
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa api này?',
        listActionButton: listButton,
      },
      'XÓA API',
    );
  };

  const onRemoveFunction = (functionId: number) => {
    const onConfirm = () => {
      removeFunction(focusApi, functionId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa function thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
        })
        .finally(() => reloadFunction());
    };

    const listButton: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: onConfirm,
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa function này?',
        listActionButton: listButton,
      },
      'XÓA FUNCTION',
    );
  };

  const onEditFunction = (functionId: number) => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '325px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <FunctionDetail
      //       config={EnumFunctionDetailConfig.edit}
      //       reloadFunction={reloadFunction}
      //       moduleId={focusApi}
      //       functionId={functionId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onAddFuntion = () => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '325px',
      //   title: 'Thêm mới',
      //   isManualRemove: true,
      //   data: <MapFunctionDetail reloadFunction={reloadFunction} apiId={focusApi} />,
      //   isContext: false,
      // },
    });
  };

  const onEditApi = (apiId: number) => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '325px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <ApiDetail
      //       config={EnumApiDetailConfig.edit}
      //       reloadFunction={reloadFunction}
      //       apiId={apiId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  //Function in list button
  const onAddApiNew = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '475px',
        //   height: '325px',
        //   title: 'Thêm api mới',
        //   isManualRemove: true,
        //   data: <ApiDetail config={EnumApiDetailConfig.add} reloadFunction={reloadFunction} />,
        //   isContext: false,
        // },
      });
    }
  };

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onAddApiNew,
      align: 'center',
    },
  ];

  useEffect(() => {
    if (focusApi) {
      getFunctionByApiId(focusApi)
        .then((data) => {
          setFunctionList(data);
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
  }, [addPopup, focusApi, getFunctionByApiId, reloadFlag]);

  useEffect(() => {
    getApi()
      .then((data) => {
        setApiList(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getApi, reloadFlag]);

  //Main
  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Danh sách API'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      /> */}
      <div className="api-container">
        <div className="api-name-container">
          <div className={`api-name title`}>
            <div className="api-name-left">
              <div className="api-name-name title">METHOD</div>
              <div className="api-name-action-type title">ACCTION</div>
              <div className="api-name-des title">ROUTER</div>
            </div>
            <div className="api-name-btn-container"></div>
          </div>
          {apiList
            ? apiList.map((value: ApiType) => {
                return (
                  <div className={`api-name ${focusApi == value.apiId ? 'focus' : ''}`}>
                    <div className="api-name-left">
                      <div
                        className="api-name-name"
                        onClick={() => {
                          setFocusApi(value.apiId);
                        }}
                      >
                        {value.displayOrder}.{' '}
                        {value.methodId == EnumHttpMethod.DELETE
                          ? 'DELETE'
                          : value.methodId == EnumHttpMethod.GET
                          ? 'GET'
                          : value.methodId == EnumHttpMethod.POST
                          ? 'POST'
                          : value.methodId == EnumHttpMethod.PUT
                          ? 'PUT'
                          : null}
                      </div>
                      <div
                        className="api-name-action-type"
                        onClick={() => {
                          setFocusApi(value.apiId);
                        }}
                      >
                        {value.actionTypeId == EnumActionType.Add
                          ? 'Add'
                          : value.actionTypeId == EnumActionType.Edit
                          ? 'Edit'
                          : value.actionTypeId == EnumActionType.View
                          ? 'View'
                          : value.actionTypeId == EnumActionType.Confirm
                          ? 'Confirm'
                          : value.actionTypeId == EnumActionType.Delete
                          ? 'Delete'
                          : null}
                      </div>
                      <div
                        className="api-name-des"
                        onClick={() => {
                          setFocusApi(value.apiId);
                        }}
                      >
                        {value.router}
                      </div>
                    </div>
                    <div className="api-name-btn-container">
                      <div
                        className="api-name-btn-edit"
                        onClick={() => {
                          onEditApi(value.apiId);
                          setFocusApi(value.apiId);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </div>
                      <div
                        className="api-name-btn-delete"
                        onClick={() => {
                          onDeleteApi(value.apiId);
                          setFocusApi(value.apiId);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        <div className="api-detail-container">
          <div className="api-detail-component title">
            <div className="api-detail-component-id">ID</div>
            <div className="api-detail-component-name">NAME</div>
            <div className="api-detail-component-des">DESCRIPTION</div>
            <div className="api-detail-component-delete">Xóa</div>
          </div>
          {functionList
            ? functionList.map((value, index: number) => {
                return (
                  <div className={`api-detail-component ${index % 2 == 0 ? 'chan' : 'le'}`}>
                    <div className="api-detail-component-id">{value.functionId}</div>
                    <div className="api-detail-component-name">{value.functionName}</div>
                    <div className="api-detail-component-des">{value.description}</div>
                    <div
                      className="api-detail-component-delete"
                      onClick={() => {
                        onRemoveFunction(value.functionId);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                  </div>
                );
              })
            : null}
          {focusApi ? (
            <div className="add-funtion-container">
              <div
                className="add-funtion-btn"
                onClick={() => {
                  onAddFuntion();
                }}
              >
                <span className="material-icons">add</span>Thêm funtion
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ApiScreen;
