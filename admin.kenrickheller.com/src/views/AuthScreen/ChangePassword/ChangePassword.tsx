import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from 'src/api/backend-api';
import AuthWrapper from 'src/components/AuthWrapper/AuthWrapper';
import { useAddPopup } from 'src/state/application/hooks';
import './ChangePassword.css';
import AuthInput from 'src/components/AuthInput/AuthInput';

const Verify: React.FC = () => {
  const navigate = useNavigate();
  //State
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState<string | undefined>(undefined);
  const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] = useState(null);

  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState(null);

  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const changePassword = useChangePassword();

  const onPressBtnChangePassword = () => {
    const isEmail = validateEmail();
    const isCurrentPassword = validateCurrentPassword();
    const isPassword = validatePassword();
    const isConfirmPassword = validateConfirmPassword();
    if (isEmail && isCurrentPassword && isPassword && isConfirmPassword) {
      changePassword(email, currentPassword, password, confirmPassword)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Đổi mật khẩu thành công',
            },
          });
          navigate(`/auth?email=${email}`);
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
  };

  const validateEmail = () => {
    let isContinue = true;

    if (!email || email == '') {
      isContinue = false;
      setEmailErrorMessage('Chưa nhập email');
    } else {
      setEmailErrorMessage(null);
    }

    return isContinue;
  };

  const validateCurrentPassword = () => {
    let isContinue = true;

    if (!currentPassword || currentPassword == '') {
      isContinue = false;
      setCurrentPasswordErrorMessage('Chưa nhập mật khẩu cũ');
    } else setCurrentPasswordErrorMessage(null);

    return isContinue;
  };

  const validatePassword = () => {
    let isContinue = true;

    if (!password || password == '') {
      isContinue = false;
      setPasswordErrorMessage('Chưa nhập mật khẩu mới');
    } else setPasswordErrorMessage(null);

    return isContinue;
  };

  const validateConfirmPassword = () => {
    let isContinue = true;

    if (!confirmPassword || confirmPassword == '') {
      isContinue = false;
      setConfirmPasswordErrorMessage('Chưa xác nhận mật khẩu');
    } else if (confirmPassword !== password) {
      isContinue = false;
      setConfirmPasswordErrorMessage('Không khớp');
    } else {
      setConfirmPasswordErrorMessage(null);
    }

    return isContinue;
  };

  //TODO
  const handlePressInput = (event: any) => {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);

    if (event.key.toLowerCase() === 'enter') {
      if (focusInput >= 1 && focusInput <= 3) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      } else {
        onPressBtnChangePassword();
      }
    } else if (event.key.toLowerCase() === 'arrowdown') {
      if (focusInput >= 1 && focusInput <= 3) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      }
    } else if (event.key.toLowerCase() === 'arrowup') {
      if (focusInput >= 2 && focusInput <= 4) {
        setFocusInput(focusInput - 1);
        form.elements[index - 1].focus();
        event.preventDefault();
      }
    }
  };

  //Main
  return (
    <AuthWrapper title="Đổi mật khẩu">
      <form className="input-form-component">
        <AuthInput
          leftIcon="far fa-envelope"
          placeholder="Email"
          value={email}
          errorMessage={emailErrorMessage}
          type="text"
          onChange={(value) => setEmail(value)}
          onKeyDown={handlePressInput}
          onBlur={() => validateEmail()}
        />
        <AuthInput
          leftIcon="fa fa-fingerprint"
          rightIcon={`far ${isHiddenPassword ? 'fa-eye-slash' : 'fa-eye'}`}
          rightAction={() => setIsHiddenPassword(!isHiddenPassword)}
          placeholder="Mật khẩu cũ"
          value={currentPassword}
          errorMessage={currentPasswordErrorMessage}
          type={isHiddenPassword ? 'password' : 'text'}
          onChange={(value) => setCurrentPassword(value)}
          onKeyDown={handlePressInput}
          onBlur={() => validateCurrentPassword()}
        />

        <AuthInput
          leftIcon="fas fa-fingerprint"
          rightIcon={`far ${isHiddenPassword ? 'fa-eye-slash' : 'fa-eye'}`}
          rightAction={() => setIsHiddenPassword(!isHiddenPassword)}
          placeholder="Mật khẩu mới"
          value={password}
          errorMessage={passwordErrorMessage}
          type={isHiddenPassword ? 'password' : 'text'}
          onChange={(value) => setPassword(value)}
          onKeyDown={handlePressInput}
          onBlur={() => validatePassword()}
        />

        <AuthInput
          leftIcon="fas fa-fingerprint"
          rightIcon={`far ${isHiddenPassword ? 'fa-eye-slash' : 'fa-eye'}`}
          rightAction={() => setIsHiddenPassword(!isHiddenPassword)}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          errorMessage={confirmPasswordErrorMessage}
          type={isHiddenPassword ? 'password' : 'text'}
          onChange={(value) => setConfirmPassword(value)}
          onKeyDown={handlePressInput}
          onBlur={() => validatePassword()}
        />
      </form>
      <button
        className="login-btn"
        onClick={() => {
          onPressBtnChangePassword();
        }}
      >
        Đổi mật khẩu
      </button>
    </AuthWrapper>
  );
};

export default Verify;
