import React from 'react';
import PropTypes from 'prop-types';

import './radioButton.scss';

const RadioButton = ({ label, checked, onClickRadioButton }) => {
  let className = 'radio-button';
  if (checked) {
    className += ' radio-button--checked';
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClickRadioButton();
      }}
    >
      {label}
    </button>
  );
};

RadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onClickRadioButton: PropTypes.func.isRequired,
};

export default RadioButton;
