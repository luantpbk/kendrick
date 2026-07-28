import React from 'react';
import './AuthWrapper.css';
import useLogo from 'src/hooks/useLogo';
import { useNavigate } from 'react-router-dom';

interface IAuthWrapper {
  title?: string;
  children: React.ReactNode;
}

const AuthWrapper = (props: IAuthWrapper) => {

  const navigate = useNavigate();
  const logo = useLogo();
  const { title, children } = props;

  return (
    <div className='login-container '>
      <div className="login-wrapper">
        <div className="login-form-header">
          <i className="fas fa-arrow-left" onClick={() => {
            window.scrollTo(0, 0);
            navigate(-1)
          }}></i>
          <label className="login-title">{title}</label>
        </div>
        <img className="login-logo" src={logo} alt="logo" />
        <div className="login-form">
          <div className="login-form-child">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthWrapper;

