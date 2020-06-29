import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Input from '../input/Input';

import './NumberPicker.scss';

const NumberPicker = ({ standardInputValue, inputId, handleChange }) => (
  <div className="number-picker">
    <Button
      name="check"
      label="&lt;"
      clickHandler={() => handleChange(Number(standardInputValue) - 1, inputId)}
    />
    <Input
      value={standardInputValue.toString()}
      type="text"
      id={inputId}
      onChange={({ value }) => handleChange(value.replace(/\D/g, '').substr(0, 3), inputId)}
    />
    <Button
      name="check"
      label="&gt;"
      clickHandler={() => handleChange(Number(standardInputValue) + 1, inputId)}
    />
  </div>
);

NumberPicker.propTypes = {
  standardInputValue: PropTypes.number.isRequired,
  inputId: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
};

NumberPicker.defaultProps = {
  handleChange: () => {},
};

export default NumberPicker;
