import './Login.css';
import React, { useCallback, useState } from 'react';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import { useAddPopup, useSetProfileInfo } from 'src/state/application/hooks';
import { useGetUserInfo, useLoginGoogle, useLoginWithEmail } from 'src/api/backend-api';
import { NavLink, useNavigate } from 'react-router-dom';
import useQuery from 'src/hooks/useQuery';
import AuthInput from 'src/components/AuthInput/AuthInput';
import AuthWrapper from 'src/components/AuthWrapper/AuthWrapper';

const Login: React.FC = () => {
  //Value
  const clientId = useConfiguration().clientId;
  const query = useQuery();
  const mail = query.get('email');
  //State
  const [email, setEmail] = useState<string>(mail);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);

  const [password, setPassword] = useState<string | undefined>('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);

  const [focusInput, setFocusInput] = useState(null);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const loginWithEmail = useLoginWithEmail();
  const loginGoogle = useLoginGoogle();
  const navigate = useNavigate();
  const setProfileInfo = useSetProfileInfo();
  const getUserInfo = useGetUserInfo();

  const validateEmail = () => {
    let isContinue = true;
    if (!email || email == '') {
      isContinue = false;
      setEmailErrorMessage('Vui lòng điền vào mục này');
    } else setEmailErrorMessage(null);

    return isContinue;
  };

  const validatePassword = () => {
    let isContinue = true;
    if (!password || password == '') {
      isContinue = false;
      setPasswordErrorMessage('Vui lòng điền vào mục này');
    } else setPasswordErrorMessage(null);

    return isContinue;
  };

  const onPressBtnLogin = () => {
    const isEmail = validateEmail();
    const isPassword = validatePassword();
    if (isEmail && isPassword) {
      onLogin();
    }
  };

  const onLogin = useCallback(() => {
    loginWithEmail(email, password)
      .then((data) => {
        getUserInfo(data.token)
          .then((profile) => {
            setProfileInfo({
              accessToken: data.token,
              refreshToken: data.refreshToken,
              info: profile,
            });
          })
          .catch((error) => {
            addPopup({
              error: {
                message: error.errorMessage,
                title: 'Đã có lỗi xảy ra!',
              },
            });
          });
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [loginWithEmail, email, password, getUserInfo, setProfileInfo, addPopup]);

  const onLoginGoogle = useCallback(
    (accessToken: string) => {
      if (accessToken) {
        loginGoogle(accessToken)
          .then((data) => {
            const accessToken = data.token;
            getUserInfo(accessToken)
              .then((profile) => {
                setProfileInfo({
                  accessToken: accessToken,
                  refreshToken: data.refreshToken,
                  info: profile,
                });

                navigate('/');
              })
              .catch((error) => {
                addPopup({
                  error: {
                    message: error.errorMessage,
                    title: 'Đã có lỗi xảy ra!',
                  },
                });
              });
          })
          .catch((error) => {
            addPopup({
              error: {
                message: error.errorMessage,
                title: 'Đã có lỗi xảy ra!',
              },
            });
          });
      } else {
        addPopup({
          error: {
            message: '',
            title: 'Đã có lỗi xảy ra!',
          },
        });
      }
    },
    [addPopup, getUserInfo, loginGoogle, navigate, setProfileInfo],
  );

  const handlePressInput = (event: any) => {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);

    if (event.key.toLowerCase() === 'enter') {
      if (focusInput == 1) {
        form.elements[index + 1].focus();
        event.preventDefault();
      } else {
        onPressBtnLogin();
      }
    } else if (event.key.toLowerCase() === 'arrowdown') {
      if (focusInput == 1) {
        form.elements[index + 1].focus();
        setFocusInput(2);
        event.preventDefault();
      }
    } else if (event.key.toLowerCase() === 'arrowup') {
      if (focusInput == 2) {
        setFocusInput(1);
        form.elements[index - 1].focus();
        event.preventDefault();
      }
    }
  };
  //End of function

  //Main
  return (
    <AuthWrapper title="Đăng nhập">
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
          placeholder="Mật khẩu"
          value={password}
          errorMessage={passwordErrorMessage}
          type={isHiddenPassword ? 'password' : 'text'}
          onChange={(value) => setPassword(value)}
          onKeyDown={handlePressInput}
          onBlur={() => validatePassword()}
        />
      </form>
      <button className="login-btn" onClick={() => onPressBtnLogin()}>
        Đăng nhập
      </button>
      <div className="text-btn-login-container">
        <NavLink to={'/auth/forgot-password'}>Quên mật khẩu</NavLink>
        <NavLink to={'/auth/change-password'}> Đổi mật khẩu</NavLink>
      </div>
      <div>HOẶC</div>
      <div className="login-google">
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLoginButton loginGoogle={onLoginGoogle} />
        </GoogleOAuthProvider>
      </div>
      <div className="text-btn-login-container center mb-0">
        Bạn chưa có tài khoản<span style={{ margin: 5 }}></span>
        <NavLink to={'/auth/register'}>Đăng ký</NavLink>
      </div>
    </AuthWrapper>
  );
};

export default Login;

interface GoogleLoginButtonProp {
  loginGoogle: (accessToken: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProp> = (props) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => props.loginGoogle(tokenResponse.access_token),
  });

  return (
    <button onClick={() => login()} className="login-btn-au">
      <div className="login-btn-au_img"></div>
      Đăng nhập với Google
    </button>
  );
};
