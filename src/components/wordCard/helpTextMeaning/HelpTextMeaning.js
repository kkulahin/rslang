import React from 'react';
import PropTypes from 'prop-types';

const HelpTextMeaning = ({ helpSettings: { isHelpTextMeaning }, word: { textMeaning, textMeaningTranslate } }) => {
	const element = (
		<li className='help-content-text__item'>
			<p className='text-item'>{textMeaning}</p>
			<p className='text-item'>{textMeaningTranslate}</p>
		</li>
	);

	return (
		isHelpTextMeaning ? element : null
	);
}

export default HelpTextMeaning;

HelpTextMeaning.propTypes = {
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	// wordTranslate: PropTypes.string.isRequired,
	// image: PropTypes.string.isRequired,
	// isHelpImage: PropTypes.bool.isRequired,
};
