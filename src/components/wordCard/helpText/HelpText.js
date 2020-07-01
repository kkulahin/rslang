import React from 'react';
import PropTypes from 'prop-types';
import HelpTextFormatted from './HelpTextFormatted';

const HelpText = ({
  helpSettings: {
    isTranscriptionShow,
    isWordTranslateShow,
    isTextExampleShow,
    isTextMeaningShow,
    isTranslateShow,
  },
  word: {
    definition: {
      transcription,
      wordTranslate,
      textExample,
      textExampleTranslate,
      textMeaning,
      textMeaningTranslate,
    },
  },
  isWordInput,
  isPrevWord,
}) => {
  const isFullState = isWordInput || isPrevWord;

  const transcriptionElem = (isTranscriptionShow)
    ? transcription
    : null;

  const wordTranslateElem = (isWordTranslateShow)
    ? wordTranslate
    : null;

  let classes = 'text-item--translate text-item--hidden';
  if (isFullState) {
    classes = 'text-item--translate';
  }

  const helpElement = (
    <li className="help-content-text__item">
      <p className="text-item">
        <span>{transcriptionElem}</span>
        {' '}
        <span><b>{wordTranslateElem}</b></span>
        {!wordTranslateElem && isTranslateShow && <span className={classes}>{wordTranslate}</span>}
      </p>
    </li>
  );

  const textExampleElement = (
    <li className="help-content-text__item">
      <p className="text-item">
        <HelpTextFormatted text={textExample} isFullState={isFullState} />
      </p>
      {isTranslateShow && <p className={classes}>{textExampleTranslate}</p>}
    </li>
  );

  const textMeaningElement = (
    <li className="help-content-text__item">
      <p className="text-item">
        <HelpTextFormatted text={textMeaning} isFullState={isFullState} />
      </p>
      {isTranslateShow && <p className={classes}>{textMeaningTranslate}</p>}
    </li>
  );

  return (
    <ul className="help-content__text">
      {(isTranscriptionShow || isWordTranslateShow) ? helpElement : null}
      {isTextExampleShow ? textExampleElement : null}
      {isTextMeaningShow ? textMeaningElement : null}
    </ul>
  );
};

export default HelpText;

HelpText.propTypes = {
  helpSettings: PropTypes.shape({
    isTranscriptionShow: PropTypes.bool.isRequired,
    isWordTranslateShow: PropTypes.bool.isRequired,
    isTextExampleShow: PropTypes.bool.isRequired,
    isTextMeaningShow: PropTypes.bool.isRequired,
    isTranslateShow: PropTypes.bool.isRequired,
  }).isRequired,
  word: PropTypes.shape({
    definition: PropTypes.shape({
      transcription: PropTypes.string.isRequired,
      wordTranslate: PropTypes.string.isRequired,
      textExample: PropTypes.string.isRequired,
      textExampleTranslate: PropTypes.string.isRequired,
      textMeaning: PropTypes.string.isRequired,
      textMeaningTranslate: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isWordInput: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
};
