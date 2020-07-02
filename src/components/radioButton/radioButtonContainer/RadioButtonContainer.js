import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './radioButtonContainer.scss';
import RadioButton from '../radioButton/RadioButton';

const RadioButtonContainer = ({
  items, checkedItem, onChange, isDisabled, isAttention, className,
}) => {
  const [checkedItemLocal, setCheckedItem] = useState(checkedItem);

  let classNameRbn = 'card-radio-button-container';
  if (isAttention) {
    classNameRbn += ' card-radio-button-container--attention';
  }
  if (isDisabled) {
    classNameRbn = 'card-radio-button-container card-radio-button-container--disabled';
  }

  const radioButtons = items.map((item) => (
    <RadioButton
      label={item.label}
      id={item.id}
      checked={checkedItemLocal === item.id}
      onClickRadioButton={(e) => {
        const { id } = e.target;
        const newIdx = id === checkedItemLocal ? null : item.id;
        setCheckedItem(newIdx);
        onChange(e, newIdx);
      }}
      key={item.id}

    />
  ));

  return <div className={`radio-button-container ${classNameRbn} ${className}`}>{radioButtons}</div>;
};

RadioButtonContainer.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  checkedItem: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isAttention: PropTypes.bool,
  className: PropTypes.string,
};

RadioButtonContainer.defaultProps = {
  className: '',
  isDisabled: false,
  isAttention: false,
};

export default RadioButtonContainer;
