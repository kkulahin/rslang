import React, { useRef, useEffect } from 'react';
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
  buttonClassName,
  ...rest
}) => {
  const button = useRef(null);
  const icon = iconName ? <Icon name={iconName} /> : null;
  let className = `button ${buttonClassName}`;

  useEffect(() => {
    if (button.current !== null && Object.keys(rest).length > 0) {
      Object.keys(rest).forEach((atr) => {
        if (rest[atr] !== null) {
          button.current.setAttribute(atr, rest[atr]);
        }
      });
    }
  }, [rest]);

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
    <>
      <button
        ref={button}
        id={id}
        type="button"
        disabled={isDisabled}
        className={`${className} ${cardClassName}`}
        onClick={(e) => clickHandler(e, e.target.id)}
      >
        {icon}
        {(label && icon) && ' '}
        {label}
      </button>
    </>
  );
};

Button.defaultProps = {
  name: 'check',
  isDisabled: false,
  isActive: false,
  iconName: '',
  label: null,
  clickHandler: () => {},
  buttonClassName: '',
};

Button.propTypes = {
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  clickHandler: PropTypes.func,
  iconName: PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default Button;
