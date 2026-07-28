import { useNavigate } from 'react-router';
import { useAddPopup } from 'src/state/application/hooks';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useProfile from 'src/hooks/useProfile';
import './ConfirmForgotPassword.css';
import useQuery from 'src/hooks/useQuery';
import { useForgotPassword } from 'src/api/backend-api';
import AuthWrapper from 'src/components/AuthWrapper/AuthWrapper';
import AuthInput from 'src/components/AuthInput/AuthInput';

const ConfirmForgotPassword: React.FC = () => {
  //Value
  const profile = useProfile();
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get('email');

  //State
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState(null);

  const [otp, setOtp] = useState('');
  const [otpErrorMessage, setOtpErrorMessage] = useState(null);

  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [focusInput, setFocusInput] = useState(null);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const changePassword = useForgotPassword();

  const handlePressInput = (event: any) => {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);

    if (event.key.toLowerCase() === 'enter') {
      if (focusInput >= 1 && focusInput <= 2) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      } else {
        onPressBtnChangePassword();
      }
    } else if (event.key.toLowerCase() === 'arrowdown') {
      if (focusInput >= 1 && focusInput <= 2) {
        form.elements[index + 1].focus();
        setFocusInput(focusInput + 1);
        event.preventDefault();
      }
    } else if (event.key.toLowerCase() === 'arrowup') {
      if (focusInput >= 2 && focusInput <= 3) {
        setFocusInput(focusInput - 1);
        form.elements[index - 1].focus();
        event.preventDefault();
      }
    }
  };

  const validatePassword = () => {
    let isContinue = true;

    if (!password || password == '') {
      isContinue = false;
      setPasswordErrorMessage('Chưa nhập mật khẩu');
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
      setConfirmPasswordErrorMessage('Không trùng nhau');
    } else {
      setConfirmPasswordErrorMessage(null);
    }

    return isContinue;
  };

  const validateOtp = () => {
    let isContinue = true;

    if (!otp || otp == '') {
      isContinue = false;
      setOtpErrorMessage('Chưa nhập mã OTP');
    } else {
      setOtpErrorMessage(null);
    }

    return isContinue;
  };

  const onPressBtnChangePassword = () => {
    const isEmail = validatePassword();
    const isPassword = validatePassword();
    const isConfirmPassword = validateConfirmPassword();

    if (isEmail && isPassword && isConfirmPassword) {
      changePassword(email, password, confirmPassword, otp)
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
          console.log(error);
        });
    }
  };

  //End of component

  //Main
  return profile ? (
    <Navigate to="/add-order" />
  ) : (
    <AuthWrapper title="Thay đổi mật khẩu">
      <form className="input-form-component">
        <AuthInput
          leftIcon="fas fa-key"
          placeholder="Mã OTP"
          value={otp}
          errorMessage={otpErrorMessage}
          type="number"
          onChange={(value) => setOtp(value)}
          onKeyDown={handlePressInput}
          onBlur={() => validateOtp()}
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
      <div className="login-form-note-text">
        Mã xác thực đã được gửi tới mail của bạn, vui lòng kiểm tra và nhập mã xác thực
      </div>
    </AuthWrapper>
  );
};

export default ConfirmForgotPassword;
