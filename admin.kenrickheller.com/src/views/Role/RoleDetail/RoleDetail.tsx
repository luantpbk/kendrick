import React, { useState, useEffect } from 'react';
import { RoleType } from 'src/api/models';
import { useGetRoleById, usePostRole, usePutRole } from 'src/api/roleApi';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';

export enum EnumRoleDetailConfig {
  view = 1,
  add = 2,
  edit = 3,
  change_pass = 4,
}

interface IRoleDetail {
  config: EnumRoleDetailConfig;
  roleId?: number;
  reloadFunction: (...args: any[]) => any;
}

const RoleDetail: React.FC<IRoleDetail> = (props) => {
  //Value
  const config = props.config;
  const roleId = props.roleId;

  //State
  const [roleName, setRoleName] = useState(null);
  const [roleNameError, setRoleNameError] = useState(null);

  const [description, setDescription] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(null);
  const [roleType, setRoleType] = useState(0);

  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const postRole = usePostRole();
  const putRole = usePutRole();
  const getRoleById = useGetRoleById();

  const onAddRole = () => {
    const temp: RoleType = {
      roleName: roleName,
      description: description,
      displayOrder: displayOrder,
      roleType: roleType,
    };
    postRole(temp)
      .then(() => {
       
        addPopup({
          txn: {
            success: true,
            summary: 'Thêm nhóm quyền thành công',
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

  const onEditRole = () => {
    if (roleId) {
      const temp: RoleType = {
        displayOrder: displayOrder,
        roleName: roleName,
        description: description,
        roleId: roleId,
        roleType: roleType,
      };
      putRole(temp)
        .then(() => {
         
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa nhóm quyền thành công',
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
  const validateRoleName = () => {
    let isContinue = true;
    if (!roleName || roleName == '') {
      isContinue = false;
      setRoleNameError('Chưa nhập tên nhóm quyền');
    } else setRoleNameError(null);
    return isContinue;
  };

  //Component
  //1
  const roleNameInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            roleName ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Role Name</div>
          <input
            type="text"
            value={roleName}
            onChange={(event) => {
              setRoleName(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateRoleName();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{roleNameError}</div>
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
    if (roleId) {
      getRoleById(roleId)
        .then((data) => {
          setRoleName(data.roleName);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
          setRoleType(data.roleType);
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
  }, [addPopup, getRoleById, roleId]);

  //Main
  return (
    <div className="user-detail-container">
      <div className="user-detai-input">
        <form>
          {roleNameInput()}
          {descriptionInput()}
          {displayOrderInput()}
        </form>
      </div>
      <div className="module-detail-btn-container">
        {config == EnumRoleDetailConfig.add ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onAddRole();
            }}
          >
            Thêm
          </div>
        ) : config == EnumRoleDetailConfig.edit ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onEditRole();
            }}
          >
            Sửa
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoleDetail;
