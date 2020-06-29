import React from 'react';
import PropTypes from 'prop-types';

import './RadioButtonContainer.scss';
import RadioButton from '../radioButton/RadioButton';

const RadioButtonContainer = ({
  items, checkedItem, onChange, isDisabled, isAttention,
}) => {
  let className = 'card-radio-button-container';
  if (isAttention) {
    className += ' card-radio-button-container--attention';
  }
  if (isDisabled) {
    className = 'card-radio-button-container card-radio-button-container--disabled';
  }

  const handleChangeRadio = (id) => {
    if (id !== checkedItem) {
      onChange(id);
    }
  };

  const radioButtons = items.map((item) => (
    <RadioButton
      label={item.label}
      id={item.id}
      checked={checkedItem === item.id}
      onClickRadioButton={handleChangeRadio}
      key={item.id}
    />
  ));

  return <div className={`radio-button-container ${className}`}>{radioButtons}</div>;
};

RadioButtonContainer.defaultProps = {
  isDisabled: false,
  isAttention: false,
};

RadioButtonContainer.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  checkedItem: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isAttention: PropTypes.bool,
};

export default RadioButtonContainer;
