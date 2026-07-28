import './Tabs.css';
import React from 'react';
import { uniqueId } from 'lodash';

interface ITabProps {
  className?: string;
  placeholder?: string;
  activeTab: number;
  tabs: {
    title: string;
    key: number;
    className?: string;
    onClick?: (...arg: any[]) => void;
  }[];
}

const Tabs: React.FC<ITabProps> = (props) => {
  return (
    <div className={`tab ${props.className ? props.className : ''}`}>
      {props.tabs.map((tab, index) => {
        return (
          <button
            key={`tab${index}`}
            className={`tablinks ${tab.className} ${
              props.activeTab == tab.key ? 'active' : ''
            }`}
            onClick={tab.onClick}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
