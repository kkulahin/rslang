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
    isImageShow,
  },
  word: {
    transcription,
    wordTranslate,
    textExample,
    textExampleTranslate,
    textMeaning,
    textMeaningTranslate,
  },
  isWordInput,
  isPrevWord,
  isEducation,
}) => {
  const isFullState = isWordInput || isPrevWord || isEducation;

  const transcriptionElem = (isTranscriptionShow && transcription)
    ? <span>{transcription}</span>
    : null;

  const wordTranslateElem = (isWordTranslateShow && wordTranslate)
    ? <span><b>{wordTranslate}</b></span>
    : null;

  let classes = 'text-item--translate text-item--hidden';
  if (isFullState) {
    classes = 'text-item--translate';
  }

  const helpElement = (
    <li className="help-content-text__item">
      <p className="text-item">
        {transcriptionElem}
        {' '}
        {wordTranslateElem}
        {!wordTranslateElem && isTranslateShow && wordTranslate
          && <span className={classes}>{wordTranslate}</span>}
      </p>
    </li>
  );

  const textExampleElement = (textExample)
    ? (
      <li className="help-content-text__item">
        <p className="text-item">
          <HelpTextFormatted text={textExample} isFullState={isFullState} />
        </p>
        {isTranslateShow && textExampleTranslate
          && <p className={classes}>{textExampleTranslate}</p>}
      </li>
    )
    : null;

  const textMeaningElement = (textMeaning)
    ? (
      <li className="help-content-text__item">
        <p className="text-item">
          {textMeaning && <HelpTextFormatted text={textMeaning} isFullState={isFullState} />}
        </p>
        {isTranslateShow && textMeaningTranslate
          && <p className={classes}>{textMeaningTranslate}</p>}
      </li>
    )
    : null;

  let containerClasses = 'help-content__text';
  if (isImageShow) {
    containerClasses = 'help-content__text help-content__text--max-height';
  }
  if (!isImageShow && (!isTextExampleShow || !isTextMeaningShow)) {
    containerClasses = 'help-content__text help-content__text--min-height';
  }
  if (!isImageShow && !isTextExampleShow && !isTextMeaningShow) {
    containerClasses = 'help-content__text help-content__text--only-height';
  }

  return (
    <ul className={containerClasses}>
      {(isTranscriptionShow || isWordTranslateShow || (isFullState && isTranslateShow)) ? helpElement : null}
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
    isImageShow: PropTypes.bool.isRequired,
  }).isRequired,
  word: PropTypes.shape({
    transcription: PropTypes.string.isRequired,
    wordTranslate: PropTypes.string.isRequired,
    textExample: PropTypes.string.isRequired,
    textExampleTranslate: PropTypes.string.isRequired,
    textMeaning: PropTypes.string.isRequired,
    textMeaningTranslate: PropTypes.string.isRequired,
  }).isRequired,
  isWordInput: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
  isEducation: PropTypes.bool.isRequired,
};
