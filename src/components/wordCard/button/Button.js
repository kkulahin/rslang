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
    dataTitle,
    dataPlacement,
  } = props;

  const icon = (iconName)
    ? <Icon name={iconName} />
    : null;

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
      {label}
    </button>
  );
};

Button.defaultProps = {
  isDisabled: false,
  isActive: false,
  iconName: '',
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
  iconName: PropTypes.string,
  dataTitle: PropTypes.string,
  dataPlacement: PropTypes.string,
};

export default Button;
