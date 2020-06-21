import React from 'react';
import PropTypes from 'prop-types';

const HelpTextExample = ({ helpSettings: { isHelpTextExample }, word: { textExample, textExampleTranslate } }) => {
	const element = (
		<li className='help-content-text__item'>
			<p className='text-item'>{textExample}</p>
			<p className='text-item'>{textExampleTranslate}</p>
		</li>
	);

	return (
		isHelpTextExample ? element : null
	);
}

export default HelpTextExample;

HelpTextExample.propTypes = {
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	// wordTranslate: PropTypes.string.isRequired,
	// image: PropTypes.string.isRequired,
	// isHelpImage: PropTypes.bool.isRequired,
};
