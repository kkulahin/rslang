import React from 'react';
import PropTypes from 'prop-types';

import './radioButtonContainer.scss';
import RadioButton from '../radioButton/RadioButton';

const RadioButtonContainer = ({
  items, checkedItem, onChange, isDisabled, isAttention, dataTitle, dataPlacement,
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

  return (
    <div
      className={className}
      data-title={dataTitle}
      data-placement={dataPlacement}
    >
      {radioButtons}
    </div>
  );
};

RadioButtonContainer.defaultProps = {
  isDisabled: false,
  isAttention: false,
  dataTitle: null,
  dataPlacement: null,
};

RadioButtonContainer.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  checkedItem: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isAttention: PropTypes.bool,
  dataTitle: PropTypes.string,
  dataPlacement: PropTypes.string,
};

export default RadioButtonContainer;
