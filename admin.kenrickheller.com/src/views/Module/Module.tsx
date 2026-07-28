import { useState } from 'react';
import React from 'react';
import ToolBar from 'src/components/ToolBar/ToolBar';
import './Module.css';
import { useDeleteModule, useGetModule } from 'src/api/moduleApi';
import { useEffect } from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import { EnumAction, EventButton, FunctionType, ModuleType } from 'src/api/models';
import { LEFT_MOUSE_BUTTON } from 'src/common/constant/Constant';
import ModuleDetail, { EnumModuleDetailConfig } from './ModuleDetail/ModuleDetail';
import { useDeleteFunction, useGetFunctionListByModuleId } from 'src/api/functionApi';
import FunctionDetail, { EnumFunctionDetailConfig } from './FunctionDetail/FunctionDetail';

const Module: React.FC = () => {
  //State
  const [focusModule, setFocusModule] = useState(null);
  const [moduleList, setModuleList] = useState<ModuleType[]>(null);
  const [functionList, setFunctionList] = useState<FunctionType[]>(null);
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const removePopup = useRemovePopup();
  const addPopup = useAddPopup();
  const getModule = useGetModule();
  const deleteModule = useDeleteModule();
  const getFunctionByModuleId = useGetFunctionListByModuleId();
  const deleteFunction = useDeleteFunction();

  const reloadFunction = () => {
    setReloadFlag(!reloadFlag);
  };

  const onDeleteModule = (moduleId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteModule(Number(moduleId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa module thành công',
            },
          });
          reloadFunction();
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
          reloadFunction();
        });
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
        action: onCancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    // addPopup({
    //   confirm: {
    //     width: '400px',
    //     height: '150px',
    //     question: 'Bạn có chắc muốn xóa module này?',
    //     listActionButton: listButton,
    //   },
    // });
  };

  const onDeleteFunction = (functionId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteFunction(Number(functionId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa function thành công',
            },
          });
          reloadFunction();
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
          reloadFunction();
        });
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
        action: onCancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    // addPopup({
    //   confirm: {
    //     width: '400px',
    //     height: '150px',
    //     question: 'Bạn có chắc muốn function này?',
    //     listActionButton: listButton,
    //   },
    // });
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
      //       moduleId={focusModule}
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
      //   data: (
      //     <FunctionDetail
      //       config={EnumFunctionDetailConfig.add}
      //       reloadFunction={reloadFunction}
      //       moduleId={focusModule}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onEditModule = (moduleId: number) => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '325px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <ModuleDetail
      //       config={EnumModuleDetailConfig.edit}
      //       reloadFunction={reloadFunction}
      //       moduleId={moduleId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  //Function in list button
  const onAddModuleNew = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '475px',
        //   height: '325px',
        //   title: 'Thêm module mới',
        //   isManualRemove: true,
        //   data: (
        //     <ModuleDetail config={EnumModuleDetailConfig.add} reloadFunction={reloadFunction} />
        //   ),
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
      action: onAddModuleNew,
      align: 'center',
    },
  ];

  useEffect(() => {
    getModule()
      .then((data) => {
        setModuleList(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getModule, reloadFlag]);

  useEffect(() => {
    if (focusModule) {
      getFunctionByModuleId(focusModule)
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
  }, [addPopup, focusModule, getFunctionByModuleId, reloadFlag]);

  //Main
  return (
    <div className="product-container">
      {/* <ToolBar
        toolbarName={'Danh sách modules của hệ thống'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      /> */}
      <div className="module-container">
        <div className="module-name-container">
          <div className={`module-name title`}>
            <div className="module-name-left">
              <div className="module-name-name title">NAME</div>
              <div className="module-name-des title">DESCRIPTION</div>
            </div>
            <div className="module-name-btn-container"></div>
          </div>
          {moduleList
            ? moduleList.map((value: ModuleType, index: number) => {
                return (
                  <div
                    className={`module-name ${focusModule == value.moduleId ? 'focus' : ''}`}
                  >
                    <div className="module-name-left">
                      <div
                        className="module-name-name"
                        onClick={() => {
                          setFocusModule(value.moduleId);
                        }}
                      >
                        {index + 1}. {value.moduleName}
                      </div>
                      <div
                        className="module-name-des"
                        onClick={() => {
                          setFocusModule(value.moduleId);
                        }}
                      >
                        {value.description}
                      </div>
                    </div>
                    <div className="module-name-btn-container">
                      <div
                        className="module-name-btn-edit"
                        onClick={() => {
                          onEditModule(value.moduleId);
                          setFocusModule(value.moduleId);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </div>
                      <div
                        className="module-name-btn-delete"
                        onClick={() => {
                          onDeleteModule(value.moduleId);
                          setFocusModule(value.moduleId);
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
        <div className="module-detail-container">
          <div className="module-detail-component title">
            <div className="module-detail-component-id">ID</div>
            <div className="module-detail-component-name">NAME</div>
            <div className="module-detail-component-des">DESCRIPTION</div>
            <div className="module-detail-component-edit">Sửa</div>
            <div className="module-detail-component-delete">Xóa</div>
          </div>
          {functionList
            ? functionList.map((value, index: number) => {
                return (
                  <div className={`module-detail-component ${index % 2 == 0 ? 'chan' : 'le'}`}>
                    <div className="module-detail-component-id">{value.functionId}</div>
                    <div className="module-detail-component-name">{value.functionName}</div>
                    <div className="module-detail-component-des">{value.description}</div>
                    <div
                      className="module-detail-component-edit"
                      onClick={() => {
                        onEditFunction(value.functionId);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </div>
                    <div
                      className="module-detail-component-delete"
                      onClick={() => {
                        onDeleteFunction(value.functionId);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                  </div>
                );
              })
            : null}
          {focusModule ? (
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

export default Module;
