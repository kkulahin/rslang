import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './button.scss';

const Button = (props) => {
  const [active, setActive] = useState(false);

  const {
    name,
    isDisabled,
    label,
    clickHandler,
    iconName,
  } = props;

  let icon = null;
  let className = 'button';

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
    <button
      type="button"
      disabled={isDisabled}
      className={className}
      onClick={
            () => {
              setActive((s) => !s);
              clickHandler();
            }
        }
    >
      {icon}
      {' '}
      {label}
    </button>
  );
};

Button.defaultProps = {
  isDisabled: false,
  clickHandler: () => { },
  iconName: '',
};

Button.propTypes = {
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  clickHandler: PropTypes.func,
  iconName: PropTypes.string,
};

export default Button;
