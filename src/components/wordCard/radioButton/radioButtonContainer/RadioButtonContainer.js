import React from 'react';
import PropTypes from 'prop-types';

import './radioButtonContainer.scss';
import RadioButton from '../radioButton/RadioButton';

const RadioButtonContainer = ({ items, checkedItem, onChange, isDisabled }) => {
	const className = isDisabled
		? 'card-radio-button-container card-radio-button-container--disabled'
		: 'card-radio-button-container';

	const radioButtons = items.map((item) => (
    <RadioButton
			label={item.label}
			id={item.id}
      checked={checkedItem === item.id}
      onClickRadioButton={onChange}
      key={item.id}
    />
  ));

  return <div className={className}>{radioButtons}</div>;
};

RadioButtonContainer.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  checkedItem: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default RadioButtonContainer;
