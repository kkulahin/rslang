import React from 'react';
import PropTypes from 'prop-types';

const getFormattedWordOnError = (errorWord, word) => {
	const correct = word.split('');
	const error = errorWord.split('');
	let errors = Math.abs(correct.length - error.length);

	for (let i = 0; i <= correct.length - 1; i += 1) {
		if (error[i] && correct[i].toLowerCase() !== error[i].toLowerCase()) {
			errors += 1;
		}
	}

	const elementClass = (errors >= 0.5 * correct.length)
		? 'word__size--errorMax'
		: 'word__size--errorMidl'

	const formattedLetters = [];
	for (let i = 0; i <= correct.length - 1; i += 1) {
		const element = (error[i] && correct[i].toLowerCase() === error[i].toLowerCase())
			? <span key={i} >{correct[i]}</span>
			: <span key={i} className={elementClass}>{correct[i]}</span>;

		formattedLetters.push(element);
	}
	
	return formattedLetters;
}

const WordInput = ({
	word: { word, wordTranslate },
	helpSettings: { isTranslateShow },
	onInputEnter, onInputFocus, onInputChange, isWordInput, inputRef, value, isCorrect, isPrevWord,
}) => {
	const currentValue = isWordInput
		? inputRef.current.value
		: '';

	let classesTranslate = 'text-item--translate text-item--hidden';
	if (isWordInput || isPrevWord) {
		classesTranslate = 'text-item--translate';
	}

	let classes = 'word__size';
	if ((isWordInput && isCorrect) || isPrevWord) {
		classes += ' word__size--correct';
	}

	const marked = (isWordInput && !isCorrect)
		? <span className='word__size word__size--visible'>{getFormattedWordOnError(currentValue, word)}</span>
		: <span className={classes}>{word}</span>

	const element = (
		<div className='word__container'>
			<span className='word__wrapper'>
				{marked}
				<input className='word__input'
					type='text'
					value={value}
					disabled={isCorrect || isPrevWord}
					autoFocus='on'
					onKeyUp={(evt) => onInputEnter(evt)}
					onFocus={() => onInputFocus()}
					onChange={(evt) => onInputChange(evt)}
					ref={inputRef}
				/>
			</span>
			{isTranslateShow && <p className={classesTranslate}>{wordTranslate}</p>}
		</div>
	);

	return element;
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
