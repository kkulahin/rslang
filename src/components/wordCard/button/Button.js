import React from 'react';
import PropTypes from 'prop-types';

import './button.scss';

const Button = (props) => {
  const {
    id,
    isDisabled,
    isActive,
    label,
    clickHandler,
    icon,
    dataTitle,
    dataPlacement,
  } = props;

  const className = (isActive)
    ? 'card-button card-button--active'
    : 'card-button';

  return (
    <button
      type="button"
      id={id}
      data-title={dataTitle}
      data-placement={dataPlacement}
      disabled={isDisabled}
      className={className}
      onClick={(evt) => clickHandler(evt.target.id)}
    >
      {icon}
      {(label && icon) && ' '}
      <span className="button__label">{label}</span>
    </button>
  );
};

Button.defaultProps = {
  isDisabled: false,
  isActive: false,
  icon: null,
  label: null,
  dataTitle: null,
  dataPlacement: null,
};

Button.propTypes = {
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  icon: PropTypes.node,
  dataTitle: PropTypes.string,
  dataPlacement: PropTypes.string,
};

export default Button;
