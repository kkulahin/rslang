import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './button.scss';

const Button = (props) => {
  const [active, setActive] = useState(false);
  const button = useRef(null);

  const {
    name,
    isDisabled,
    label,
    clickHandler,
    iconName,
    buttonClassName,
    ...rest
  } = props;

  useEffect(() => {
    if (button.current !== null && Object.keys(rest).length > 0) {
      Object.keys(rest).forEach((atr) => {
        if (rest[atr] !== null) {
          button.current.setAttribute(atr, rest[atr]);
        }
      });
    }
  }, [rest]);

  let icon = null;
  let className = `button ${buttonClassName}`;

  if (iconName) {
    icon = <Icon name={iconName} />;
  }

  if (name === 'check' && active) {
    className += ` button--${name}`;
  }

  if (name === 'press' && active) {
    className += ` button--${name}`;
  }

  if (name === 'light') {
    className += ` button--${name}`;
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        disabled={isDisabled}
        className={className}
        onClick={
            (e) => {
              setActive((s) => !s);
              clickHandler(e);
            }
        }
      >
        {icon}
        {' '}
        {label}
      </button>
    </>
  );
};

Button.defaultProps = {
  isDisabled: false,
  clickHandler: () => { },
  iconName: '',
  buttonClassName: '',
};

Button.propTypes = {
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  clickHandler: PropTypes.func,
  iconName: PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default Button;
