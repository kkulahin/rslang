import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './tabs.scss';
import Tab from './Tab';

const Tabs = ({ getActiveTab, children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const onClickTabItem = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    getActiveTab(activeTab);
  }, [getActiveTab, activeTab]);

  return (
    <div className="tabs">
      <ol className="tabs__tab-list">
        {children.map((child) => {
          const { label } = child.props;

          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className="tabs__tab-content">
        {children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  getActiveTab: PropTypes.func,
  children: PropTypes.instanceOf(Array).isRequired,
};

Tabs.defaultProps = {
  getActiveTab: () => {},
};

export default Tabs;
