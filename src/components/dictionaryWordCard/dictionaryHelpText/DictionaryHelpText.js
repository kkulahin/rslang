import React from 'react';
import PropTypes from 'prop-types';

import DictionaryAudioComponent from '../dictionaryAudioComponent/DictionaryAudioComponent';
import HelpTextFormatted from '../../wordCard/helpText/HelpTextFormatted';

const DictionaryHelpText = ({
  settings: {
    isTranscriptionShow = true,
    isWordTranslateShow = true,
    isTextExampleShow = true,
    isTextMeaningShow = true,
    isTranslateShow = true,
  },
  word: {
    transcription = '',
    wordTranslate = '',
    textExample = '',
    textExampleTranslate = '',
    textMeaning = '',
    textMeaningTranslate = '',
    audio = '',
    audioExample = '',
    audioMeaning = '',
  },
}) => {
  const isFullState = true;

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
      <DictionaryAudioComponent audio={audio} />
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
        <DictionaryAudioComponent audio={audioExample} />
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
        <DictionaryAudioComponent audio={audioMeaning} />
        <p className="text-item">
          {textMeaning && <HelpTextFormatted text={textMeaning} isFullState={isFullState} />}
        </p>
        {isTranslateShow && textMeaningTranslate
          && <p className={classes}>{textMeaningTranslate}</p>}
      </li>
    )
    : null;

  return (
    <ul className="help-content__text">
      {(isTranscriptionShow || isWordTranslateShow || (isFullState && isTranslateShow)) ? helpElement : null}
      {isTextExampleShow ? textExampleElement : null}
      {isTextMeaningShow ? textMeaningElement : null}
    </ul>
  );
};

DictionaryHelpText.defaultProps = {
  settings: {},
  word: {},
};

export default DictionaryHelpText;

DictionaryHelpText.propTypes = {
  settings: PropTypes.shape({
    isTranscriptionShow: PropTypes.bool,
    isWordTranslateShow: PropTypes.bool,
    isTextExampleShow: PropTypes.bool,
    isTextMeaningShow: PropTypes.bool,
    isTranslateShow: PropTypes.bool,
  }),
  word: PropTypes.shape({
    transcription: PropTypes.string,
    wordTranslate: PropTypes.string,
    textExample: PropTypes.string,
    textExampleTranslate: PropTypes.string,
    textMeaning: PropTypes.string,
    textMeaningTranslate: PropTypes.string,
    audio: PropTypes.string,
    audioExample: PropTypes.string,
    audioMeaning: PropTypes.string,
  }),
};
