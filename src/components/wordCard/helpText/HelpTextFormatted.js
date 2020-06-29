import React from 'react';
import PropTypes from 'prop-types';

const HelpTextFormatted = ({ text, word, isFullState }) => {
	let classes = 'text--marked';
	if (!isFullState) {
		classes += ' text--hidden';
	}

	const regexp = new RegExp(`(<b>|<i>)(${word})(<\/b>|<\/i>)`, 'i');
	const splitted = text.split(regexp);

	return (
		<React.Fragment>
			{splitted[0]}
			<span className={classes}>{splitted[2]}</span>
			{splitted[4]}
		</React.Fragment>
	);
}

export default HelpTextFormatted;

HelpTextFormatted.propTypes = {
	text: PropTypes.string.isRequired,
	word: PropTypes.string.isRequired,
	isFullState: PropTypes.bool.isRequired,
};
