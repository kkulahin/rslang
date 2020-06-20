import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './radioButtonContainer.scss';
import RadioButton from '../radioButton/RadioButton';

const RadioButtonContainer = ({ items, onChange }) => {
  const [checkedItem, setCheckedItem] = useState(null);

  const radioButtons = items.map((item, idx) => (
    <RadioButton
      label={item}
      checked={checkedItem === idx}
      onClickRadioButton={() => {
        setCheckedItem(idx);
        onChange(items[idx].toLowerCase());
      }}
      key={items[idx].toLowerCase()}
    />
  ));

  return <div className="radio-button-container">{radioButtons}</div>;
};

RadioButtonContainer.defaultProps = {
  onChange: () => {},
};

RadioButtonContainer.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func,
};

export default RadioButtonContainer;
