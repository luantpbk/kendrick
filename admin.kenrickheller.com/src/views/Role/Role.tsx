import './Role.css';
import { useState } from 'react';
import React from 'react';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { useGetModule } from 'src/api/moduleApi';
import { useEffect } from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import {
  EnumAction,
  EnumActionType,
  EventButton,
  FunctionType,
  ModuleType,
  RolePermisionType,
  RoleType,
} from 'src/api/models';
import { LEFT_MOUSE_BUTTON } from 'src/common/constant/Constant';
import { useGetFunctionListByModuleId } from 'src/api/functionApi';
import {
  useDeleteRole,
  useGetRole,
  useGetRolePermision,
  usePutRolePermision,
} from 'src/api/roleApi';
import RoleDetail, { EnumRoleDetailConfig } from './RoleDetail/RoleDetail';

const Role: React.FC = () => {
  //State
  const [focusRole, setFocusRole] = useState(null);
  const [roleList, setRoleList] = useState<RoleType[]>(null);

  const [moduleList, setModuleList] = useState<ModuleType[]>(null);
  const [focusModule, setFocusModule] = useState(null);

  const [functionList, setFunctionList] = useState<FunctionType[]>(null);
  const [rolePermisionList, setRolePermisionList] = useState<RolePermisionType[]>(null);
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const removePopup = useRemovePopup();
  const addPopup = useAddPopup();
  const getRole = useGetRole();
  const getFunctionByModuleId = useGetFunctionListByModuleId();
  const deleteRole = useDeleteRole();
  const getModule = useGetModule();
  const getRolePermision = useGetRolePermision();
  const putRolePermision = usePutRolePermision();

  const reloadFunction = () => {
    setReloadFlag(!reloadFlag);
  };

  const onDeleteRole = (roleId: number) => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteRole(Number(roleId))
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa nhóm quyền thành công',
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
    //     question: 'Bạn có chắc muốn xóa nhóm quyền này?',
    //     listActionButton: listButton,
    //   },
    // });
  };

  const onChangeTick = (isCheck: boolean, functionId: number, actionType: EnumActionType) => {
    const rolePermisionListTemp = rolePermisionList ? rolePermisionList.filter(() => true) : [];
    let isFunc = false;
    let id = 0;
    rolePermisionListTemp.map((v, index: number) => {
      if (v.functionId == functionId) {
        isFunc = true;
        id = index;
      }
    });

    if (isFunc) {
      if (actionType != EnumActionType.All) {
        if (actionType == EnumActionType.Add) {
          rolePermisionListTemp[id].actions.Add = isCheck;
        } else if (actionType == EnumActionType.View) {
          rolePermisionListTemp[id].actions.View = isCheck;
        } else if (actionType == EnumActionType.Confirm) {
          rolePermisionListTemp[id].actions.Confirm = isCheck;
        } else if (actionType == EnumActionType.Delete) {
          rolePermisionListTemp[id].actions.Delete = isCheck;
        } else if (actionType == EnumActionType.Edit) {
          rolePermisionListTemp[id].actions.Edit = isCheck;
        }
      } else {
        rolePermisionListTemp[id].actions.Add = isCheck;
        rolePermisionListTemp[id].actions.View = isCheck;
        rolePermisionListTemp[id].actions.Confirm = isCheck;
        rolePermisionListTemp[id].actions.Delete = isCheck;
        rolePermisionListTemp[id].actions.Edit = isCheck;
      }
    } else {
      if (actionType == EnumActionType.All) {
        const temp: RolePermisionType = {
          roleId: focusRole,
          functionId: functionId,
          permision: 0,
          actions: {
            View: isCheck,
            Add: isCheck,
            Confirm: isCheck,
            Edit: isCheck,
            Delete: isCheck,
          },
        };

        rolePermisionListTemp.push(temp);
      } else {
        const temp: RolePermisionType = {
          roleId: focusRole,
          functionId: functionId,
          permision: 0,
          actions: {
            View: actionType == EnumActionType.View,
            Add: actionType == EnumActionType.Add,
            Confirm: actionType == EnumActionType.Confirm,
            Edit: actionType == EnumActionType.Edit,
            Delete: actionType == EnumActionType.Delete,
          },
        };

        rolePermisionListTemp.push(temp);
      }
    }
    setRolePermisionList(rolePermisionListTemp);
  };

  const onEditRole = (roleId: number) => {
    //hiddenSLideBar();
    addPopup({
      // view: {
      //   width: '475px',
      //   height: '325px',
      //   title: 'Chỉnh sửa chi tiết',
      //   isManualRemove: true,
      //   data: (
      //     <RoleDetail
      //       config={EnumRoleDetailConfig.edit}
      //       reloadFunction={reloadFunction}
      //       roleId={roleId}
      //     />
      //   ),
      //   isContext: false,
      // },
    });
  };

  const onEditRolePermision = () => {
    putRolePermision(focusRole, focusModule, rolePermisionList)
      .then((r) => {
        if (r) {
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa danh sách phân quyền thành công',
            },
          });
        } else {
          addPopup({
            txn: {
              success: false,
              summary: 'Có lỗi gì đó',
            },
          });
        }
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

  //Function in list button
  const onAddRoleNew = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      //hiddenSLideBar();
      addPopup({
        // view: {
        //   width: '475px',
        //   height: '325px',
        //   title: 'Thêm nhóm quyền mới',
        //   isManualRemove: true,
        //   data: (
        //     <RoleDetail config={EnumRoleDetailConfig.add} reloadFunction={reloadFunction} />
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
      action: onAddRoleNew,
      align: 'center',
    },
  ];

  useEffect(() => {
    getRole()
      .then((data) => {
        setRoleList(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getRole, reloadFlag]);

  useEffect(() => {
    if (focusModule && focusRole) {
      getRolePermision(focusRole, focusModule)
        .then((data) => {
          setRolePermisionList(data);
          console.log(data);
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
  }, [addPopup, focusModule, focusRole, getRolePermision, reloadFlag]);

  useEffect(() => {
    getModule()
      .then((data) => {
        setModuleList(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
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
  }, [addPopup, focusModule, getFunctionByModuleId]);

  //Main
  return (
    <div className="product-container">
      <ToolBar
        toolbarName={'Danh sách nhóm quyền'}
        listRightButton={listButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      />
      <div className="role-container">
        <div className="role-name-container">
          <div className={`role-name title`}>
            <div className="role-name-left">
              <div className="role-name-name title">NAME</div>
              <div className="role-name-des title">DESCRIPTION</div>
            </div>
            <div className="role-name-btn-container"></div>
          </div>
          {roleList
            ? roleList.map((value: RoleType, index: number) => {
                return (
                  <div className={`role-name ${focusRole == value.roleId ? 'focus' : ''}`}>
                    <div className="role-name-left">
                      <div
                        className="role-name-name"
                        onClick={() => {
                          setFocusRole(value.roleId);
                        }}
                      >
                        {index + 1}. {value.roleName}
                      </div>
                      <div
                        className="role-name-des"
                        onClick={() => {
                          setFocusRole(value.roleId);
                        }}
                      >
                        {value.description}
                      </div>
                    </div>
                    <div className="role-name-btn-container">
                      <div
                        className="role-name-btn-edit"
                        onClick={() => {
                          onEditRole(value.roleId);
                          setFocusRole(value.roleId);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </div>
                      <div
                        className="role-name-btn-delete"
                        onClick={() => {
                          onDeleteRole(value.roleId);
                          setFocusRole(value.roleId);
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
        <div className="role-detail-container">
          <div className="role-detail-tab">
            {moduleList
              ? moduleList.map((value: ModuleType) => {
                  return (
                    <div
                      className={`role-detail-tab-component ${
                        focusModule == value.moduleId ? 'focus' : null
                      }`}
                      onClick={() => {
                        setFocusModule(value.moduleId);
                      }}
                    >
                      {value.moduleName}
                    </div>
                  );
                })
              : null}
          </div>
          <div className="role-detail-detail">
            <div className="role-detail-function-component title">
              <div className="role-detail-function-component-first title">Chức năng</div>
              <div className="role-detail-function-component-enum title">Tất cả</div>
              <div className="role-detail-function-component-enum title">Xem</div>
              <div className="role-detail-function-component-enum title">Thêm</div>
              <div className="role-detail-function-component-enum title">Sửa</div>
              <div className="role-detail-function-component-enum title">Xóa</div>
              <div className="role-detail-function-component-enum title">Xác nhận</div>
            </div>
            {functionList && focusRole
              ? functionList.map((value: FunctionType) => {
                  const fId = value.functionId;
                  let isView = false,
                    isAdd = false,
                    isConfirm = false,
                    isEdit = false,
                    isDelete = false,
                    isAll = false;

                  if (rolePermisionList) {
                    rolePermisionList.map((v: RolePermisionType) => {
                      if (v.functionId == fId) {
                        isView = v.actions.View;
                        isAdd = v.actions.Add;
                        isConfirm = v.actions.Confirm;
                        isEdit = v.actions.Edit;
                        isDelete = v.actions.Delete;
                        if (isAdd && isView && isConfirm && isEdit && isDelete) {
                          isAll = true;
                        }
                      }
                    });
                  }
                  return (
                    <div className="role-detail-function-component">
                      <div className="role-detail-function-component-first">
                        {value.functionName}
                      </div>
                      <div className="role-detail-function-component-enum">
                        <div
                          className={`role-detail-tick ${isAll ? 'focus' : null}`}
                          onClick={() => {
                            onChangeTick(!isAll, value.functionId, EnumActionType.All);
                          }}
                        >
                          {isAll ? <i className="fas fa-check"></i> : null}
                        </div>
                      </div>
                      <div className="role-detail-function-component-enum">
                        <div
                          className={`role-detail-tick ${isView ? 'focus' : null}`}
                          onClick={() => {
                            onChangeTick(!isView, value.functionId, EnumActionType.View);
                          }}
                        >
                          {isView ? <i className="fas fa-check"></i> : null}
                        </div>
                      </div>
                      <div className="role-detail-function-component-enum">
                        <div
                          className={`role-detail-tick ${isAdd ? 'focus' : null}`}
                          onClick={() => {
                            onChangeTick(!isAdd, value.functionId, EnumActionType.Add);
                          }}
                        >
                          {isAdd ? <i className="fas fa-check"></i> : null}
                        </div>
                      </div>
                      <div className="role-detail-function-component-enum">
                        <div
                          className={`role-detail-tick ${isEdit ? 'focus' : null}`}
                          onClick={() => {
                            onChangeTick(!isEdit, value.functionId, EnumActionType.Edit);
                          }}
                        >
                          {isEdit ? <i className="fas fa-check"></i> : null}
                        </div>
                      </div>
                      <div className="role-detail-function-component-enum">
                        <div
                          className={`role-detail-tick ${isDelete ? 'focus' : null}`}
                          onClick={() => {
                            onChangeTick(!isDelete, value.functionId, EnumActionType.Delete);
                          }}
                        >
                          {isDelete ? <i className="fas fa-check"></i> : null}
                        </div>
                      </div>
                      <div className="role-detail-function-component-enum">
                        <div
                          className={`role-detail-tick ${isConfirm ? 'focus' : null}`}
                          onClick={() => {
                            onChangeTick(!isConfirm, value.functionId, EnumActionType.Confirm);
                          }}
                        >
                          {isConfirm ? <i className="fas fa-check"></i> : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
            {functionList && focusRole ? (
              <div className="role-detail-function-component">
                <div className="role-detail-btn-edit" onClick={onEditRolePermision}>
                  Lưu
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
