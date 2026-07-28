import React, { useEffect, useState } from 'react';
import './ButtonComponent.css';
import Loading from '../Loading/Loading';

interface IButtonComponent {
  width?: string;
  height?: string;
  icon?: string;
  title?: string;
  onClick?: (...args: any[]) => any | Promise<any>;
  loader?: boolean;
}

const ButtonComponent: React.FC<IButtonComponent> = (props) => {
  const [isLoading, setLoading] = useState(false);
  const { width, height, icon, title, onClick, loader } = props;

  const click = () => {
    if (isLoading) return;
    if (onClick) {
      if (loader) {
        setLoading(true);
        onClick()
          .then(() => {
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        onClick();
      }
    }
  };

  return (
    <button className="button-component" onClick={click}>
      {icon && !isLoading ? (
        <span className="material-icons button-component-content">{icon}</span>
      ) : null}
      {isLoading && (
        <div className="loading-button-container">
          <Loading />
        </div>
      )}
      <label className="button-component-content">{title}</label>
    </button>
  );
};

export default ButtonComponent;
