import React from 'react';
import PropTypes from 'prop-types';

const HelpTranscription = ({ helpSettings: { isHelpTranscription }, word: { transcription } }) => {
	const element = (
		<li className='help-content-text__item'>
			<span>{transcription}</span>
		</li>
	);

	return (
		isHelpTranscription ? element : null
	);
}

export default HelpTranscription;

HelpTranscription.propTypes = {
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	// wordTranslate: PropTypes.string.isRequired,
	// image: PropTypes.string.isRequired,
	// isHelpImage: PropTypes.bool.isRequired,
};
