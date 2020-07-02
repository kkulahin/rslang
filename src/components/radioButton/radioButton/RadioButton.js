import React from 'react';
import PropTypes from 'prop-types';

import './radioButton.scss';

const RadioButton = ({
  label, id, checked, onClickRadioButton,
}) => {
  let className = 'radio-button';
  if (checked) {
    className += ' radio-button--checked';
  }

  const cardClassName = checked
    ? 'card-radio-button card-radio-button--checked'
    : 'card-radio-button';

  return (
    <button
      type="button"
      id={id}
      className={`${className} ${cardClassName}`}
      onClick={(evt) => {
        onClickRadioButton(evt);
      }}
    >
      {label}
    </button>
  );
};

RadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onClickRadioButton: PropTypes.func.isRequired,
};

export default RadioButton;
