/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import './SlideBar.css';

interface SlideBarProps {
  children: React.ReactNode;
  visible: boolean;
  changeVisible: (visible: boolean) => void;
}

const SlideBar: React.FC<SlideBarProps> = (props) => {
  const { children, visible, changeVisible } = props;

  return (
    <>

      <div className={`slidebar-background ${visible ? 'visible' : 'disable'}`} onClick={() => changeVisible(false)} />
      <div className={`slidebar-wrapper ${visible ? 'visible' : 'disable'}`} key={`slideBar`}>
        {children}
      </div>
    </>

  );
};


export default SlideBar;

