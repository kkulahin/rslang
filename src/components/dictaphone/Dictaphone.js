import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';

const micIcon = {
  on: 'microphone',
  off: 'microphone slash',
};

const options = {
  autoStart: false,
};

const propTypes = {
  getSpeechQuery: PropTypes.func,
  setInputValue: PropTypes.shape({
    current: PropTypes.object,
  }),
  transcript: PropTypes.string,
  finalTranscript: PropTypes.string,
  resetTranscript: PropTypes.func,
  startListening: PropTypes.func,
  stopListening: PropTypes.func,
  abortListening: PropTypes.func,
  listening: PropTypes.bool,
  recognition: PropTypes.shape({
    lang: PropTypes.string,
  }),
  browserSupportsSpeechRecognition: PropTypes.bool,
};

const Dictaphone = ({
  getSpeechQuery,
  setInputValue,
  transcript,
  finalTranscript,
  resetTranscript,
  startListening,
  stopListening,
  abortListening,
  listening,
  recognition,
  browserSupportsSpeechRecognition,
}) => {
  const [icon, setIcon] = useState(micIcon.on);
  const [, setSpeechVal] = useState(transcript);

  useEffect(() => {
    if (icon === micIcon.on) {
      return startListening();
    }
    return stopListening();
  }, [icon, startListening, stopListening]);

  useEffect(() => {
    if (!listening) {
      if (transcript.trim() !== '') {
        resetTranscript();
        getSpeechQuery(transcript);
      }
    }
  }, [listening, getSpeechQuery, resetTranscript, transcript]);

  useEffect(() => {
    if (finalTranscript.trim() !== '') {
      setSpeechVal(finalTranscript);
      abortListening();
      const fTranscript = finalTranscript;
      const { current } = setInputValue;
      current.value = fTranscript;
    }
  }, [finalTranscript, abortListening, setInputValue]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  // eslint-disable-next-line no-param-reassign
  recognition.lang = 'En-en';

  const onClick = () => (icon === micIcon.off ? setIcon(micIcon.on) : setIcon(micIcon.off));

  return (
    <i className={`${icon} icon`} onClick={onClick} role="presentation" />
  );
};

Dictaphone.propTypes = propTypes;
Dictaphone.defaultProps = {
  getSpeechQuery: () => {},
  setInputValue: {
    current: {},
  },
  transcript: '',
  finalTranscript: '',
  resetTranscript: () => {},
  startListening: () => {},
  stopListening: () => {},
  abortListening: () => {},
  listening: false,
  recognition: {},
  browserSupportsSpeechRecognition: false,
};

export default SpeechRecognition(options)(Dictaphone);
