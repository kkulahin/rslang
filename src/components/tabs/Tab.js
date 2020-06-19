import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ activeTab, label, onClick }) => {
  const handleClick = () => {
    onClick(label);
  };

  let className = 'tabs__tab-list__tab-list-item';

  if (activeTab === label) {
    className += ' tabs__tab-list__tab-list-item--active';
  }

  return (
    <li className={className}>
      <button type="button" onClick={handleClick} onKeyDown={handleClick}>
        {label}
      </button>
    </li>
  );
};

Tab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Tab;
