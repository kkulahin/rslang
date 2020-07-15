import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '../../wordCard/button/Button';
import AudioPlayIcon from '../../wordCard/icons/AudioPlayIcon';

const DictionaryAudioComponent = ({ audio }) => {
  const audioRef = useRef();

  const [isDisabled, setIsDisabled] = useState(false);

  const handleAudioPlayBtnClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setIsDisabled(true);
  };

  const onAudioError = () => {
    setIsDisabled(true);
  };

  const onAudioEnded = () => {
    setIsDisabled(false);
  };

  return (
    <div className="card-controls__audio-btn">
      <Button
        id="speakWord"
        isDisabled={isDisabled}
        clickHandler={handleAudioPlayBtnClick}
        icon={<AudioPlayIcon iconTitle="audio play icon" />}
      />
      <audio
        ref={audioRef}
        src={`data:audio/mpeg;base64, ${audio}`}
        onError={onAudioError}
        onEnded={onAudioEnded}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
};

DictionaryAudioComponent.defaultProps = {
  audio: '',
};

export default DictionaryAudioComponent;

DictionaryAudioComponent.propTypes = {
  audio: PropTypes.string,
};
