import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

const Input = ({
	value,
	id,
	type,
	onChange,
	label,
	icon,
	placeholder,
	pattern,
	isDisabled,
	isRequired,
	autoComplete,
}) => {
	const handleChange = (evt) => {
		evt.preventDefault();
		const { id, value } = evt.target;
		onChange({ id, value });
	};

	return (
		<div className='input__container'>
			<input className='input'
				type={type}
				id={id}
				required={isRequired}
				value={value}
				placeholder={placeholder}
				autoComplete={autoComplete}
				disabled={isDisabled}
				onChange={handleChange}
				pattern={pattern}
			/>
			{ label && <label className='input__label' htmlFor={id}>{label}</label> }
			{ icon && <div className='input__icon' style={{ backgroundImage: `url(${icon})` }} /> }
		</div>
	);
}

Input.defaultProps = {
	label: null,
	icon: null,
	placeholder: null,
	pattern: null,
	isDisabled: false,
	isRequired: true,
	autoComplete: 'off',
};

export default Input;

Input.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	icon: PropTypes.any,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	pattern: PropTypes.string,
	autoComplete: PropTypes.string,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
};
