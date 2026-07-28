import { useAddPopup } from 'src/state/application/hooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenOtp } from 'src/api/backend-api';
import './ForgotPassword.css';
import AuthWrapper from 'src/components/AuthWrapper/AuthWrapper';
import AuthInput from 'src/components/AuthInput/AuthInput';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  //State
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const genOtp = useGenOtp();

  const handlePressInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      onPressBtnGenOtp();
      event.preventDefault();
    }
  };

  const validateEmail = () => {
    let isContinue = true;

    if (!email || email == '') {
      isContinue = false;
      setEmailErrorMessage('Chưa nhập email');
    } else setEmailErrorMessage(null);

    return isContinue;
  };

  const onPressBtnGenOtp = () => {
    const isEmail = validateEmail();

    if (isEmail) {
      genOtp(email)
        .then((data) => {
          if (data) {
            navigate(`/auth/confirm-forgot-password?email=${email}`);
          } else {
            addPopup({
              error: { message: 'Email này chưa đăng ký', title: 'Đã có lỗi xảy ra!' },
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //End of component

  //Main
  return (
    <AuthWrapper title="Quên mật khẩu">
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
      </form>
      <button
        className="login-btn"
        onClick={() => {
          onPressBtnGenOtp();
        }}
      >
        Gửi mã OTP
      </button>
      <div className="login-form-note-text">
        Chúng tôi sẽ gửi email chưa mã OTP đến bạn, vui lòng kiểm tra hộp thư
      </div>
    </AuthWrapper>
  );
};

export default ForgotPassword;
