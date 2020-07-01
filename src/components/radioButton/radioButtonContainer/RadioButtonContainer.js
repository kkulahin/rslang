import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './radioButtonContainer.scss';
import RadioButton from '../radioButton/RadioButton';

const RadioButtonContainer = ({ items, onChange, className }) => {
  const [checkedItem, setCheckedItem] = useState(null);

  const radioButtons = items.map((item, idx) => (
    <RadioButton
      label={item}
      className={className}
      checked={checkedItem === idx}
      onClickRadioButton={(e) => {
        const newIdx = idx === checkedItem ? null : idx;
        setCheckedItem(newIdx);
        onChange(e, items[idx].toLowerCase());
      }}
      key={items[idx].toLowerCase()}
    />
  ));

  return <div className={`radio-button-container ${className}`}>{radioButtons}</div>;
};

RadioButtonContainer.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

RadioButtonContainer.defaultProps = {
  onChange: () => {},
  className: '',
};

export default RadioButtonContainer;
