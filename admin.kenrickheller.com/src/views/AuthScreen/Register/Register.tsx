import './Register.css';
import React, { useState } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import { useRegisterWithEmail } from 'src/api/backend-api';
import { useNavigate } from 'react-router-dom';
import useQuery from 'src/hooks/useQuery';
import AuthWrapper from 'src/components/AuthWrapper/AuthWrapper';
import AuthInput from 'src/components/AuthInput/AuthInput';

const Register: React.FC = () => {
  //Value
  const query = useQuery();
  const mail = query.get('email');
  const navigate = useNavigate();
  //State
  const [fullName, setFullName] = useState(null);
  const [fullNameError, setFullNameError] = useState(null);

  const [email, setEmail] = useState<string | undefined>(mail);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);

  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [focusInput, setFocusInput] = useState(null);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const registerWithEmail = useRegisterWithEmail();

  //Validate
  const validateFullName = () => {
    let isContinue = true;
    if (!fullName || fullName == '') {
      isContinue = false;
      setFullNameError('Chưa nhập tên');
    } else setFullNameError(null);

    return isContinue;
  };

  const validateEmail = () => {
    let isContinue = true;
    if (!email || email == '') {
      isContinue = false;
      setEmailErrorMessage('Chưa nhập email');
    } else setEmailErrorMessage(null);

    return isContinue;
  };

  const validatePassword = () => {
    let isContinue = true;
    if (!password || password == '') {
      isContinue = false;
      setPasswordErrorMessage('Chưa nhập mật khẩu');
    } else setPasswordErrorMessage(null);

    validateConfirmPassword();
    return isContinue;
  };

  const validateConfirmPassword = () => {
    let isContinue = true;
    if (!confirmPassword || confirmPassword == '') {
      isContinue = false;
      setConfirmPasswordError('Chưa xác nhận mật khẩu');
    } else setConfirmPasswordError(null);

    if (password != confirmPassword) {
      setConfirmPasswordError('Không trùng mật khẩu');
    } else {
      setConfirmPasswordError(null);
    }
    return isContinue;
  };
  //End of validate

  const onPressBtnRegister = () => {
    const isEmail = validateEmail();
    const isPassword = validatePassword();
    const isFullName = validateFullName();
    const isConfirmPassword = validateConfirmPassword();

    if (isEmail && isPassword && isFullName && isConfirmPassword) {
      onRegister();
    }
  };

  const onRegister = () => {
    registerWithEmail(email, email, fullName, password, confirmPassword)
      .then(() => {
        navigate(`/auth/confirm-register?email=${email}`);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  };

  const handlePressInput = (event: any) => {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);
    if (event.key.toLowerCase() === 'enter') {
      if (focusInput >= 1 && focusInput <= 3) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      } else {
        onPressBtnRegister();
      }
    } else if (event.key.toLowerCase() === 'arrowdown') {
      if (focusInput >= 1 && focusInput <= 3) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      }
    } else if (event.key.toLowerCase() === 'arrowup') {
      if (focusInput <= 4 && focusInput >= 2) {
        setFocusInput(focusInput - 1);
        form.elements[index - 1].focus();
        event.preventDefault();
      }
    }
  };
  //End of function

  //Main
  return (
    <AuthWrapper title="Đăng ký">
      <AuthInput
        leftIcon="far fa-user"
        placeholder="Họ và tên"
        value={fullName}
        errorMessage={fullNameError}
        type="text"
        onChange={(value) => setFullName(value)}
        onKeyDown={handlePressInput}
        onBlur={() => validateFullName()}
      />
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
        placeholder="Mật khẩu"
        value={password}
        errorMessage={passwordErrorMessage}
        type={isHiddenPassword ? 'password' : 'text'}
        onChange={(value) => setPassword(value)}
        onKeyDown={handlePressInput}
        onBlur={() => validatePassword()}
      />
      <AuthInput
        leftIcon="fa fa-fingerprint"
        rightIcon={`far ${isHiddenPassword ? 'fa-eye-slash' : 'fa-eye'}`}
        rightAction={() => setIsHiddenPassword(!isHiddenPassword)}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        errorMessage={confirmPasswordError}
        type={isHiddenPassword ? 'password' : 'text'}
        onChange={(value) => setConfirmPassword(value)}
        onKeyDown={handlePressInput}
        onBlur={() => validatePassword()}
      />

      <button
        className="login-btn"
        onClick={() => {
          onPressBtnRegister();
        }}
      >
        Đăng ký
      </button>
    </AuthWrapper>
  );
};

export default Register;
