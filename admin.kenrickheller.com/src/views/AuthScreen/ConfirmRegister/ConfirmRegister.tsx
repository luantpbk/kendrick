import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReSentOtp, useVerify } from 'src/api/backend-api';
import AuthWrapper from 'src/components/AuthWrapper/AuthWrapper';
import AuthInput from 'src/components/AuthInput/AuthInput';
import useQuery from 'src/hooks/useQuery';
import { useAddPopup } from 'src/state/application/hooks';
import './ConfirmRegister.css';

const ConfirmRegister: React.FC = () => {
  //Value
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get('email');

  //State
  const [otp, setOtp] = useState(null);
  const [otpError, setOtpError] = useState(null);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const verify = useVerify();
  const resentOtp = useReSentOtp();

  const onResentOtp = () => {
    if (email) {
      resentOtp(email)
        .then((r) => {
          if (r) {
            addPopup({
              txn: {
                success: true,
                summary: 'Đã gửi lại OTP',
              },
            });
          } else {
            addPopup({
              txn: {
                success: false,
                summary: 'Có lỗi xảy ra',
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    }
  };

  const validateOtp = () => {
    let isContinue = true;

    if (!otp || otp == '') {
      isContinue = false;
      setOtpError('Chưa nhập mã OTP');
    } else setOtpError(null);

    return isContinue;
  };

  const onPressBtnSentOtp = () => {
    const isOtp = validateOtp();
    if (isOtp && email) {
      verify(email, otp)
        .then((data) => {
          if (data) {
            navigate(`/auth?email=${data.email}`);
            addPopup({
              txn: {
                success: true,
                summary: 'Đăng ký thành công',
              },
            });
          } else {
            addPopup({
              error: { message: 'Email này chưa đăng ký', title: 'Đã có lỗi xảy ra!' },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
          });
        });
    }
  };

  //Main
  return (
    <AuthWrapper title="Xác nhận đăng ký">
      <div className="forgot-password-title">Nhập mã OTP</div>
      <form>
        <AuthInput
          leftIcon="fas fa-key"
          placeholder="Mã OTP"
          value={otp}
          errorMessage={otpError}
          type="number"
          onChange={(value) => setOtp(value)}
          onBlur={() => validateOtp()}
        />
      </form>
      <div
        className="confirm-register-btn"
        onClick={() => {
          onPressBtnSentOtp();
        }}
      ></div>
      <div className="text-btn-login-container center mb-0">
        Bạn chưa nhận được mã OTP<span style={{ margin: 5 }}></span>
        <span
          style={{ color: 'red' }}
          onClick={() => {
            onResentOtp();
          }}
        >
          Gửi lại
        </span>
      </div>
      <div className="verify-confirm-text-container">
        PUGANIGRAVIO <br /> <br /> Website:{' '}
        <a href="https://puganigravio.com">https://puganigravio.com</a> <br />
        Email: puganigravio@gmail.com <br /> Hotline:{' '}
        <a href="tel:070-8332-6668">07083326668</a>
      </div>
    </AuthWrapper>
  );
};

export default ConfirmRegister;
