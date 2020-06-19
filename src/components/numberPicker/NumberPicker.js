import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Input from '../input/Input';

import './NumberPicker.scss';

const NumberPicker = ({ standardInputValue, inputId, handleChange }) => {
  const [inputValue, setInputValue] = useState(standardInputValue);

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
    handleChange(newInputValue);
  };

  const handleBtnEvents = {
    increaseInputValue: () => handleInputChange(Number(inputValue) + 1),
    decreaseInputValue: () => handleInputChange(Number(inputValue) - 1),
  };

  return (
    <div className="number-picker">
      <Button
        name="check"
        label="&lt;"
        clickHandler={handleBtnEvents.decreaseInputValue}
      />
      <Input
        value={inputValue.toString()}
        type="text"
        id={inputId}
        onChange={({ value }) => handleInputChange(value.replace(/\D/g, '').substr(0, 3))}
      />
      <Button
        name="check"
        label="&gt;"
        clickHandler={handleBtnEvents.increaseInputValue}
      />
    </div>
  );
};

NumberPicker.propTypes = {
  standardInputValue: PropTypes.number.isRequired,
  inputId: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
};

NumberPicker.defaultProps = {
  handleChange: () => {},
};

export default NumberPicker;
