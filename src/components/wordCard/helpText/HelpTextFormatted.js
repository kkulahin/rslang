import React from 'react';
import PropTypes from 'prop-types';

const HelpTextFormatted = ({ text, word, isWordInput }) => {
	let classes = 'text--marked';
	if (!isWordInput) {
		classes += ' text--hidden';
	}

	const regexp = new RegExp(`(<b>|<i>)(${word})(<\/b>|<\/i>)`, 'i');
	const splitted = text.split(regexp);

	return (
		<span>
			{splitted[0]}
			<span className={classes}>{splitted[2]}</span>
			{splitted[4]}
		</span>
	);
}

export default HelpTextFormatted;

HelpTextFormatted.propTypes = {
	text: PropTypes.string.isRequired,
	word: PropTypes.string.isRequired,
	isWordInput: PropTypes.bool.isRequired,
};
