import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss';

const Checkbox = ({
  labelContent, handleSwitch, inputId, isChecked,
}) => (
  <label htmlFor={inputId}>
    <input
      id={inputId}
      type="checkbox"
      className="checkbox"
      checked={isChecked}
      onChange={handleSwitch}
    />
    {labelContent}
  </label>
);

Checkbox.propTypes = {
  labelContent: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  handleSwitch: PropTypes.func.isRequired,
};

Checkbox.defaultProps = {
  labelContent: '',
  isChecked: false,
};

export default Checkbox;
