import React, { useState } from 'react';
import PropTypes from 'prop-types';

const WordInput = ({ word: { word } }) => {
	const [value, setValue] = useState('');

	const handleChange = (evt) => {
		setValue(evt.target.value);
	}

	const element = (
		<div className='word__container'>
			<span className='word__wrapper'>
				<span className='word__size'>{word}</span>
				<input className='word__input'
					type='text'
					value={value}
					onChange={handleChange}
				/>
			</span>
		</div>
	);

	return (
		element
	);
}

export default WordInput;

WordInput.propTypes = {
	word: PropTypes.object.isRequired,
	// wordTranslate: PropTypes.string.isRequired,
	// image: PropTypes.string.isRequired,
	// isHelpImage: PropTypes.bool.isRequired,
};
