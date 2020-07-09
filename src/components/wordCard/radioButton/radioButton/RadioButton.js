import React from 'react';
import PropTypes from 'prop-types';

import './radioButton.scss';

const RadioButton = ({
  label, id, checked, onClickRadioButton, icon,
}) => {
  const className = checked
    ? 'card-radio-button card-radio-button--checked'
    : 'card-radio-button';

  return (
    <button
      type="button"
      id={id}
      className={className}
      onClick={(evt) => onClickRadioButton(evt.target.id)}
    >
      {icon}
      {(label && icon) && ' '}
      <span className="radio-button__label">{label}</span>
    </button>
  );
};

RadioButton.defaultProps = {
  checked: false,
  icon: null,
  label: null,
  onClickRadioButton: () => {},
};

RadioButton.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClickRadioButton: PropTypes.func,
  icon: PropTypes.node,
};

export default RadioButton;
