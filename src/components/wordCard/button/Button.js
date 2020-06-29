import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './button.scss';

const Button = (props) => {
  const {
    id,
    isDisabled,
    isActive,
    label,
    clickHandler,
    iconName,
  } = props;

  const icon = (iconName)
    ? icon = <Icon name={iconName} />
    : null;

  const className = (isActive)
    ? 'card-button card-button--active'
    : 'card-button';

  return (
    <button
      type="button"
      id={id}
      disabled={isDisabled}
      className={className}
      onClick={(evt) => clickHandler(evt.target.id)}
    >
      {icon}
      {(label && icon) && ' '}
      {label}
    </button>
  );
};

Button.defaultProps = {
  isDisabled: false,
  isActive: false,
  iconName: '',
  label: null,
};

Button.propTypes = {
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  iconName: PropTypes.string,
};

export default Button;
