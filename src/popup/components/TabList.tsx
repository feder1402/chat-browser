import React from 'react';
import { TabInfo } from '../../types/chrome';

interface TabListProps {
  tabs: TabInfo[];
  onTabClick: (tabId: number) => void;
}

const TabList: React.FC<TabListProps> = ({ tabs, onTabClick }) => {
  return (
    <div className="tabs-container">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`tab-item ${tab.active ? 'active-tab' : ''}`}
          onClick={() => onTabClick(tab.id)}
        >
          <div className="tab-url">{tab.url}</div>
          <div className="tab-title">{tab.title}</div>
        </div>
      ))}
    </div>
  );
};

export default TabList;