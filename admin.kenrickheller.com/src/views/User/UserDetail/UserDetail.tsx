import React, { useState, useEffect } from 'react';
import { ProfileInfo } from 'src/api/models';
import {
  useChangeUserPassword,
  useGetUserById,
  usePostUser,
  usePutUser,
} from 'src/api/userApi';
import { useAddPopup, useReloadTable, useRemovePopup } from 'src/state/application/hooks';
import './UserDetail.css';

export enum EnumUserDetailConfig {
  view = 1,
  add = 2,
  edit = 3,
  change_pass = 4,
}

interface IUserDetail {
  config: EnumUserDetailConfig;
  userId?: number;
}

const UserDetail: React.FC<IUserDetail> = (props) => {
  //Value
  const config = props.config;
  const userId = props.userId;

  //State
  const [fullName, setFullName] = useState(null);
  const [fullNameError, setFullNameError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const getUserById = useGetUserById();
  const postUser = usePostUser();
  const putUser = usePutUser();
  const changeUserPassword = useChangeUserPassword();
  const removePopup = useRemovePopup();
  const reloadTable = useReloadTable();

  const handlePressInput = (event: any) => {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);

    if (event.key.toLowerCase() === 'enter') {
      if (
        focusInput >= 1 &&
        focusInput <= 2 &&
        (config == EnumUserDetailConfig.add || config == EnumUserDetailConfig.change_pass)
      ) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      } else if (focusInput == 1) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      } else {
        if (config == EnumUserDetailConfig.add) {
          const isEmail = validateEmail();
          const isPassword = validatePassword();
          const isFullName = validateFullName();
          if (isEmail && isPassword && isFullName) {
            onPostUser();
          }
        } else if (config == EnumUserDetailConfig.edit) {
          const isEmail = validateEmail();
          const isFullName = validateFullName();
          if (isEmail && isFullName) {
            onPutUser();
          }
        } else if (config == EnumUserDetailConfig.change_pass) {
          const isPassword = validatePassword();
          if (isPassword) {
            onChangePassword();
          }
        }
      }
    } else if (event.key.toLowerCase() === 'arrowdown') {
      if (
        (focusInput >= 1 && focusInput <= 2 && config != EnumUserDetailConfig.edit) ||
        (focusInput == 1 && config == EnumUserDetailConfig.edit)
      ) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      }
    } else if (event.key.toLowerCase() === 'arrowup') {
      if (focusInput >= 2 && focusInput <= 3 && config != EnumUserDetailConfig.change_pass) {
        setFocusInput(focusInput - 1);
        form.elements[index - 1].focus();
        event.preventDefault();
      }
    }
  };

  const onPostUser = () => {
    postUser(email, password, fullName)
      .then(() => {
        reloadTable();
       
        addPopup({
          txn: {
            success: true,
            summary: 'Thêm tài khoản thành công',
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

  const onPutUser = () => {
    const user: ProfileInfo = {
      email: email,
      loginName: email,
      fullName: fullName,
      userId: userId,
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

  const onChangePassword = () => {
    const user: ProfileInfo = {
      loginName: email,
      currentPassword: '',
      password: password,
      confirmPassword: password,
      otp: '',
    };
    changeUserPassword(user)
      .then(() => {
       
        reloadTable();
        addPopup({
          txn: {
            success: true,
            summary: 'Thay đổi mật khẩu thành công',
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

  //Validate
  const validateFullName = () => {
    let isContinue = true;

    if (!fullName || fullName == '') {
      isContinue = false;
      setFullNameError('Chưa nhập tên');
    } else setFullNameError(null);

    return isContinue;
  };

  const validatePassword = () => {
    let isContinue = true;

    if (!password || password == '') {
      isContinue = false;
      setPasswordError('Chưa nhập mật khẩu');
    } else setPasswordError(null);

    return isContinue;
  };

  const validateEmail = () => {
    let isContinue = true;

    if (!email || email == '') {
      isContinue = false;
      setEmailError('Chưa nhập email');
    } else setEmailError(null);

    return isContinue;
  };
  //End of validate

  //Component
  //1
  const fullNameInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            fullName ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Tên</div>
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
              validateFullName();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
            onKeyDown={handlePressInput}
            disabled={
              config == EnumUserDetailConfig.view || config == EnumUserDetailConfig.change_pass
            }
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{fullNameError}</div>
      </>
    );
  };

  //2
  const emailInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            email ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Email</div>
          <input
            type="text"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              validateEmail();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
            onKeyDown={handlePressInput}
            disabled={
              config == EnumUserDetailConfig.view || config == EnumUserDetailConfig.change_pass
            }
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{emailError}</div>
      </>
    );
  };

  //3
  const passwordInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 3 ? 'focus-input' : ''} ${
            password ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Mật khẩu</div>
          <input
            type="text"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(3);
            }}
            onBlur={() => {
              validatePassword();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
            onKeyDown={handlePressInput}
            disabled={config == EnumUserDetailConfig.view}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{passwordError}</div>
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
          setEmail(data.email);
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

  //Main
  return (
    <div className="user-detail-container">
      <div className="user-detai-input">
        <form>
          {fullNameInput()}
          {emailInput()}
          {config == EnumUserDetailConfig.add || config == EnumUserDetailConfig.change_pass
            ? passwordInput()
            : null}
        </form>
      </div>
      <div className="user-detail-btn-container">
        {config == EnumUserDetailConfig.add ? (
          <div className="btn-add-user" onClick={onPostUser}>
            Thêm
          </div>
        ) : config == EnumUserDetailConfig.edit ? (
          <div className="btn-edit-user" onClick={onPutUser}>
            Sửa
          </div>
        ) : config == EnumUserDetailConfig.change_pass ? (
          <div className="btn-edit-user" onClick={onChangePassword}>
            Đổi mật khẩu
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserDetail;
