import './Login.css';
import React, { useCallback, useState } from 'react';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import { useAddPopup, useSetProfileInfo } from 'src/state/application/hooks';
import { useGetUserInfo, useLoginGoogle, useLoginWithEmail } from 'src/api/backend-api';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLogo from 'src/hooks/useLogo';

const Login: React.FC = () => {
  //Value
  const clientId = useConfiguration().clientId;
  const { t, i18n } = useTranslation();
  //Function
  const addPopup = useAddPopup();
  const loginWithEmail = useLoginWithEmail();
  const loginGoogle = useLoginGoogle();
  const navigate = useNavigate();
  const setProfileInfo = useSetProfileInfo();
  const getUserInfo = useGetUserInfo();

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
                    title: 'An error occurred.',
                  },
                });
              });
          })
          .catch((error) => {
            addPopup({
              error: {
                message: error.errorMessage,
                title: 'An error occurred.',
              },
            });
          });
      } else {
        addPopup({
          error: {
            message: '',
            title: 'An error occurred.',
          },
        });
      }
    },
    [addPopup, getUserInfo, loginGoogle, navigate, setProfileInfo],
  );

  //End of function
  const logo = useLogo();

  //Main
  return (
    <div className="login-container" title={t("Login")}>
      <div className="login-content" >
        <img className="login-logo" src={logo} alt="logo" />
        <div className="login-google">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLoginButton loginGoogle={onLoginGoogle} />
          </GoogleOAuthProvider>
        </div>
      </div>

    </div>
  );
};

export default Login;


interface GoogleLoginButtonProp {
  loginGoogle: (accessToken: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProp> = (props) => {
  const { t } = useTranslation();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => props.loginGoogle(tokenResponse.access_token),
  });

  return (
    <button onClick={() => login()} className="login-btn-au">
      <div className="login-btn-au_img"></div>
      {t("Sign in with Google")}
    </button>
  );
};
