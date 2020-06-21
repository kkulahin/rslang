import React from 'react';
import PropTypes from 'prop-types';

import HelpTextFormatted from './HelpTextFormatted';

const HelpText = ({
	helpSettings: {
		isHelpTranscription,
		isHelpWordTranslate,
		isHelpTextExample,
		isHelpTextMeaning,
	},
	word: {
		word,
		transcription,
		wordTranslate,
		textExample,
		textExampleTranslate,
		textMeaning,
		textMeaningTranslate,
	},
	isWordInput,
}) => {

	const transcriptionElem = (isHelpTranscription)
		? transcription
		: null

	const wordTranslateElem = (isHelpWordTranslate)
		? wordTranslate
		: null

	const helpElement = (
		<li className='help-content-text__item'>
			<p className='text-item'>
				<span><b>{wordTranslateElem}</b></span>
				{' '}
				<span>{transcriptionElem}</span>
			</p>
		</li>
	);

	let classes = 'text-item text-item--hidden';
	if (isWordInput) {
		classes = 'text-item';
	}

	const textExampleElement = (
		<li className='help-content-text__item'>
			<p className='text-item'>
				<HelpTextFormatted text={textExample} word={word} isWordInput={isWordInput} />
			</p>
			<p className={classes}>{textExampleTranslate}</p>
		</li>
	);

	const textMeaningElement = (
		<li className='help-content-text__item'>
			<p className='text-item'>
				<HelpTextFormatted text={textMeaning} word={word} isWordInput={isWordInput} />
			</p>
			<p className={classes}>{textMeaningTranslate}</p>
		</li>
	);

	return (
		<ul className='help-content__text'>
			{(isHelpTranscription || isHelpWordTranslate) ? helpElement : null}
			{isHelpTextExample ? textExampleElement : null}
			{isHelpTextMeaning ? textMeaningElement : null}
		</ul>
	);
}

export default HelpText;

HelpText.propTypes = {
	helpSettings: PropTypes.shape({
		isHelpTranscription: PropTypes.bool.isRequired,
		isHelpWordTranslate: PropTypes.bool.isRequired,
		isHelpTextExample: PropTypes.bool.isRequired,
		isHelpTextMeaning: PropTypes.bool.isRequired,
	}),
	word: PropTypes.shape({
		word: PropTypes.string.isRequired,
		transcription: PropTypes.string.isRequired,
		wordTranslate: PropTypes.string.isRequired,
		textExample: PropTypes.string.isRequired,
		textExampleTranslate: PropTypes.string.isRequired,
		textMeaning: PropTypes.string.isRequired,
		textMeaningTranslate: PropTypes.string.isRequired,
	}),
	isWordInput: PropTypes.bool.isRequired,
};
