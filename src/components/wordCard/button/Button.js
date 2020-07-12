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
      onClick={() => clickHandler(id)}
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
  clickHandler: () => {},
};

Button.propTypes = {
  id: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  label: PropTypes.string,
  clickHandler: PropTypes.func,
  icon: PropTypes.node,
  dataTitle: PropTypes.string,
  dataPlacement: PropTypes.string,
};

export default Button;
