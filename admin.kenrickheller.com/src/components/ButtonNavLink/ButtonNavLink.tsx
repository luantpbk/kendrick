import React from 'react';
import { NavLink } from 'react-router-dom';
import './ButtonNavLink.css';

interface IButtonNavLink {
  link?: string;
  activeClass?: string;
  iconName?: string;
  name?: string;
  backgroundColor?: string;
  color?: string;
  buttonClass?: string;
  onClick?: (...args: any[]) => any;
  isFocus?: boolean;
}

const ButtonNavLink: React.FC<IButtonNavLink> = (props) => {
  return props.link ? (
    <NavLink
      to={props.link}
      className={`nav-link ${props.buttonClass}`}
    >
      <button className="nav-btn" onClick={props.onClick}>
        <span className="material-icons">{props.iconName}</span> &nbsp;
        {props.name}
      </button>
    </NavLink>
  ) : (
    <button
      className={`nav-btn no-link ${props.isFocus ? 'focus' : ''}`}
      onClick={props.onClick}
    >
      <span className="material-icons">{props.iconName}</span> &nbsp;
      {props.name}
    </button>
  );
};

export default ButtonNavLink;
