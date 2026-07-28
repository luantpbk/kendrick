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
  buttonClass: string;
  onClick?: (...args: any[]) => any;
}

const ButtonNavLink: React.FC<IButtonNavLink> = (props) => {
  return (
    <NavLink
      to={props.link}
      className={'nav-link' + ' ' + props.buttonClass + ' ' + props.activeClass}
    >
      <button className="nav-btn" onClick={props.onClick}>
        <span className="material-icons">{props.iconName}</span> &nbsp;
        {props.name}
      </button>
    </NavLink>
  );
};

export default ButtonNavLink;
