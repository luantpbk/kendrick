import React, { useState, useEffect } from 'react';
import { ProfileInfo, RoleType } from 'src/api/models';
import {
  useGetRole,
  useGetRoleUserId,
  useMapRoleWithUser,
  useRemoveRoleWithUser,
} from 'src/api/roleApi';
import { useGetUserById, usePutUser } from 'src/api/userApi';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import './UserSlideBar.css';

interface ISlideBarDetail {
  userId: number;
}

const UserSlideBar: React.FC<ISlideBarDetail> = (props) => {
  //Value
  const userId = props.userId;

  //State
  const [roleList, setRoleList] = useState<RoleType[]>(null);
  const [allRole, setAllRole] = useState<RoleType[]>(null);
  const [focusRole, setFocusRole] = useState<any>('null');
  const [fullName, setFullName] = useState(undefined);
  const [telephone, setTelephone] = useState(undefined);
  const [email, setEmail] = useState(null);
  const [mainAddress, setMainAddress] = useState(undefined);
  const [focusInput, setFocusInput] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  //End of state

  //Function
  const getUserById = useGetUserById();
  const addPopup = useAddPopup();
  const putUser = usePutUser();
  const reloadTable = useReloadTable();
  const removePopup = useRemovePopup();
  const getRole = useGetRole();
  const getRoleByUserId = useGetRoleUserId();
  const mapRoleWithUser = useMapRoleWithUser();
  const removeRoleWithUser = useRemoveRoleWithUser();

  const onPutUser = () => {
    const user: ProfileInfo = {
      userId: userId,
      loginName: email,
      fullName: fullName,
      telephone: telephone,
      email: email,
      mainAddress: mainAddress,
    };
    putUser(user)
      .then(() => {
        reloadTable();
       
        addPopup({
          txn: {
            success: true,
            summary: 'Sửa tài khoản thành công',
          },
        });
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessagr,
          },
        });
      });
  };

  const onMapRoleWithUser = () => {
    if (focusRole && focusRole !== null) {
      mapRoleWithUser(userId, focusRole)
        .then(() => {
          setReloadFlag(!reloadFlag);
          addPopup({
            txn: {
              success: true,
              summary: 'Thêm nhóm quyền thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra!',
              message: error.errorMessage,
            },
          });
        });
    }
  };

  const onRemoveRole = (roleId: number) => {
    if (focusRole && focusRole !== null) {
      removeRoleWithUser(userId, roleId)
        .then(() => {
          setReloadFlag(!reloadFlag);
          addPopup({
            txn: {
              success: true,
              summary: 'Đã xóa nhóm quyền',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra!',
              message: error.errorMessage,
            },
          });
        });
    }
  };

  //Component
  //1
  const fullNameInput = () => {
    return (
      <>
        <div
          className={`slide-bar-detail-input ${focusInput == 1 ? 'focus-input' : ''} ${
            fullName ? 'validate-input' : ''
          }`}
        >
          <div className="slide-bar-detail-input-title">Tên</div>
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
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
      </>
    );
  };

  //2
  const telephoneInput = () => {
    return (
      <>
        <div
          className={`slide-bar-detail-input ${focusInput == 2 ? 'focus-input' : ''} ${
            telephone ? 'validate-input' : ''
          }`}
        >
          <div className="slide-bar-detail-input-title">Số điện thoại</div>
          <input
            type="text"
            value={telephone}
            onChange={(event) => {
              setTelephone(event.target.value);
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

  //3
  const emailInput = () => {
    return (
      <>
        <div
          className={`slide-bar-detail-input ${focusInput == 3 ? 'focus-input' : ''} ${
            email ? 'validate-input' : ''
          }`}
        >
          <div className="slide-bar-detail-input-title">Email</div>
          <input
            type="text"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
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

  //4
  const mainAddressInput = () => {
    return (
      <>
        <div
          className={`slide-bar-detail-input ${focusInput == 4 ? 'focus-input' : ''} ${
            mainAddress ? 'validate-input' : ''
          }`}
        >
          <div className="slide-bar-detail-input-title">Địa chỉ</div>
          <textarea
            value={mainAddress}
            onChange={(event) => {
              setMainAddress(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(4);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 4}
          />
        </div>
      </>
    );
  };
  //End of component

  //useEffect
  useEffect(() => {
    if (userId) {
      getUserById(userId)
        .then((data) => {
          setFullName(data.fullName);
          setTelephone(data.telephone);
          setEmail(data.email);
          setMainAddress(data.mainAddress);
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
  }, [addPopup, getUserById, userId]);

  useEffect(() => {
    if (userId) {
      getRoleByUserId(userId)
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
    }
  }, [addPopup, getRoleByUserId, userId, reloadFlag]);

  useEffect(() => {
    getRole()
      .then((data) => {
        setAllRole(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getRole]);

  //Main
  return (
    <div className="slide-bar-detail-container user">
      <div className="slide-bar-detail-form m-2">
        <div className="slide-bar-detail-title">THÔNG TIN TÀI KHOẢN</div>
        <form>
          {fullNameInput()}
          {telephoneInput()}
          {emailInput()}
          {mainAddressInput()}
        </form>
        <div className="slide-bar-detail-title">Danh sách nhóm quyền</div>
        <div className="slide-bar-role-container">
          {roleList
            ? roleList.map((value: RoleType, index: number) => {
                return (
                  <div className={`slide-bar-role-component ${index % 2 == 0 ? 'chan' : 'le'}`}>
                    <div className="slide-bar-role-name">
                      {index + 1}. {value.roleName}
                    </div>
                    <div
                      className="slide-bar-role-btn-delete"
                      onClick={() => {
                        onRemoveRole(value.roleId);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                  </div>
                );
              })
            : null}
          <div className="slide-bar-role-component btn-component">
            <select
              value={focusRole}
              className="slide-bar-role-option"
              onChange={(event) => {
                setFocusRole(Number(event.target.value));
                event.preventDefault();
              }}
            >
              <option value="null">Chọn nhóm quyền</option>
              {allRole
                ? allRole.map((value: RoleType) => {
                    return <option value={value.roleId}>{value.roleName}</option>;
                  })
                : null}
            </select>
            <div className="slide-bar-add-role-btn" onClick={onMapRoleWithUser}>
              Thêm
            </div>
          </div>
        </div>
      </div>
      <div className="slide-bar-detail-detail-wrapper m-2">
        <div className="slide-bar-user-btn" onClick={onPutUser}>
          Sửa
        </div>
      </div>
    </div>
  );
};

export default UserSlideBar;
