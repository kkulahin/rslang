import React from 'react';
import PropTypes from 'prop-types';

import './Switcher.scss';

const Switcher = ({
  parrentClassName, switcherId, isChecked, isRequired, onChange,
}) => {
  const switcherClassName = (parrentClassName)
    ? `${parrentClassName}__switcher switcher--stylise`
    : 'switcher switcher--stylise';

  return (
    <div className={switcherClassName}>
      <input
        type="checkbox"
        checked={isChecked}
        data-required={isRequired}
        onChange={() => onChange(switcherId)}
      />
    </div>
  );
};

Switcher.propTypes = {
  parrentClassName: PropTypes.string,
  switcherId: PropTypes.number.isRequired,
  isChecked: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

Switcher.defaultProps = {
  parrentClassName: '',
  isRequired: false,
};

export default Switcher;
