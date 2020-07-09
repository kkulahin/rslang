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
    : 'word__size--error';

  const formattedLetters = [];
  for (let i = 0; i <= correct.length - 1; i += 1) {
    const element = (error[i] && correct[i].toLowerCase() === error[i].toLowerCase())
      ? <span key={i}>{correct[i]}</span>
      : <span key={i} className={elementClass}>{correct[i]}</span>;

    formattedLetters.push(element);
  }

  return formattedLetters;
};

const WordInput = ({
  word: { word },
  onInputEnter,
  onInputFocus,
  onInputChange,
  isWordInput,
  value,
  currentValue,
  isCorrect,
  isPrevWord,
  isEducation,
  inputRef,
}) => {
  let classes = 'word__size';
  if ((isWordInput && isCorrect) || isPrevWord || isEducation) {
    classes += ' word__size--correct';
  }

  const marked = (isWordInput && !isCorrect)
    ? (
      <span className="word__size word__size--visible">
        {getFormattedWordOnError(currentValue, word)}
      </span>
    )
    : <span className={classes}>{word}</span>;

  const element = (
    <div className="word__container">
      <span className="word__wrapper">
        {marked}
        <input
          className="word__input"
          type="text"
          value={value}
          disabled={isCorrect || isPrevWord || isEducation}
          onKeyDown={(evt) => onInputEnter(evt)}
          onFocus={() => onInputFocus(true)}
          onBlur={() => onInputFocus(false)}
          onChange={(evt) => onInputChange(evt)}
          ref={inputRef}
        />
      </span>
    </div>
  );

  return element;
};

export default WordInput;

WordInput.propTypes = {
  word: PropTypes.shape({
    word: PropTypes.string.isRequired,
  }).isRequired,
  onInputFocus: PropTypes.func.isRequired,
  onInputEnter: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isWordInput: PropTypes.bool.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
  isEducation: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired,
};
