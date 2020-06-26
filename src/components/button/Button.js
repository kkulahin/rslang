import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './button.scss';

const Button = ({
  id,
  name,
  isDisabled,
  isActive,
  label,
  clickHandler,
  iconName,
}) => {
  const icon = iconName ? <Icon name={iconName} /> : null;
  let className = 'button';

  if (name === 'check' && isActive) {
    className += ` button--${name}`;
  }

  if (name === 'press' && isActive) {
    className += ` button--${name}`;
  }

  if (name === 'light') {
    className += ` button--${name}`;
  }

  const cardClassName = (isActive)
    ? 'card-button card-button--active'
    : 'card-button';

  return (
    <button
      type="button"
      id={id}
      disabled={isDisabled}
      className={`${className} ${cardClassName}`}
      onClick={(evt) => clickHandler(evt.target.id)}
    >
      {icon}
      {(label && icon) && ' '}
      {label}
    </button>
  );
};

Button.defaultProps = {
  id: '',
  name: 'check',
  isDisabled: false,
  isActive: false,
  iconName: '',
  label: null,
  clickHandler: () => {},
};

Button.propTypes = {
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  clickHandler: PropTypes.func,
  iconName: PropTypes.string,
};

export default Button;
