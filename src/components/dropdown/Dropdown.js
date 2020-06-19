import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './dropdown.scss';

const DropdownItem = (props) => {
  const { label, onClickDropdownItem } = props;

  return (
    <div
      role="button"
      className="dropdown__item"
      onClick={() => onClickDropdownItem(label)}
      onKeyPress={() => { }}
      tabIndex={0}
    >
      <span className="dropdown__item-text">{label}</span>
      <hr />
    </div>

  );
};

DropdownItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClickDropdownItem: PropTypes.func.isRequired,
};

const DownIcon = (props) => {
  const { name } = props;
  return <Icon name={name} />;
};

DownIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

const Dropdown = ({
  values, defaultValue, onChange,
}) => {
  const [expand, setExpand] = useState(false);
  const [title, setTitle] = useState(values[defaultValue]);

  const iconName = expand ? 'angle right' : 'angle down';
  let dropdownContentClass = 'dropdown__content';

  if (expand) {
    dropdownContentClass += ' dropdown__content--open';
  }

  const dropdownItems = values.map((value, idx) => (
    <DropdownItem
      label={value}
      key={`item ${idx + 1}`}
      onClickDropdownItem={(text) => {
        setTitle(text);
        onChange(values.indexOf(text));
        setExpand(false);
      }}
    />
  ));

  const dropdownContent = (
    <div className={dropdownContentClass}>
      { dropdownItems }
    </div>
  );

  return (
    <div className="dropdown">
      <button
        type="button"
        className="dropdown__title"
        onClick={() => {
          setExpand((s) => !s);
        }}
      >
        {title}
        <DownIcon name={iconName} />
      </button>
      {expand ? dropdownContent : null}
    </div>
  );
};

Dropdown.defaultProps = {
  onChange: () => {},
};

Dropdown.propTypes = {
  values: PropTypes.instanceOf(Array).isRequired,
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default Dropdown;
