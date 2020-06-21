import React from 'react';
import PropTypes from 'prop-types';

const WordInput = ({
	word: { word }, onInputEnter, onInputFocus, onInputChange, isWordInput, inputRef, value, isCorrect
}) => {

	let classes = 'word__size';
	if (isWordInput && isCorrect) {
		classes += ' word__size--correct';
	}

	if (isWordInput && !isCorrect) {
		classes += ' word__size--error';
	}

	const element = (
		<div className='word__container'>
			<span className='word__wrapper'>
				<span className={classes}>{word}</span>
				<input className='word__input'
					type='text'
					value={value}
					disabled={isCorrect}
					autoFocus='on'
					onKeyUp={(evt) => onInputEnter(evt)}
					onFocus={() => onInputFocus()}
					onChange={(evt) => onInputChange(evt)}
					ref={inputRef}
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
	word: PropTypes.shape({
		word: PropTypes.string.isRequired,
	}),
	inputRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]).isRequired,
	onInputFocus: PropTypes.func.isRequired,
	onInputEnter: PropTypes.func.isRequired,
	isWordInput: PropTypes.bool.isRequired,
};
