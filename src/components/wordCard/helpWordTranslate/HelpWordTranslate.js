import React from 'react';
import PropTypes from 'prop-types';

const HelpWordTranslate = ({ helpSettings: { isHelpWordTranslate }, word: { wordTranslate } }) => {
	const element = (
		<li className='help-content-text__item'>
			<span>{wordTranslate}</span>
		</li>
	);

	return (
		isHelpWordTranslate ? element : null
	);
}

export default HelpWordTranslate;

HelpWordTranslate.propTypes = {
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	// wordTranslate: PropTypes.string.isRequired,
	// image: PropTypes.string.isRequired,
	// isHelpImage: PropTypes.bool.isRequired,
};
