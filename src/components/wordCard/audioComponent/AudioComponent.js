import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '../button/Button';
import Spinner from '../spinner/Spinner';
import { urlToAssets } from '../../../constants/urls';
import Word from '../../../utils/spacedRepetition/Word';

const AudioComponent = (props) => {
  const {
    helpSettings: { isTextExampleShow, isTextMeaningShow },
    settings: { isComplexityBtn },
    word: { definition: { audio, audioExample, audioMeaning } },
    onAudioEnd,
    isPrevWord,
    isCorrect,
    isShowBtnClick,
    isAudioOn,
  } = props;

  const audioRef = useRef();

  const [currentTruck, setCurrentTruck] = useState(0);
  const [isAudioPlay, setIsAudioPlay] = useState(false);
  const [audioData, setAudioData] = useState({
    loading: true,
    src: null,
    error: null,
  });

  let audioPromise;
  const tracks = [];

  if (audio) {
    tracks.push(urlToAssets + audio);
  }
  if (isTextExampleShow && audioExample) {
    tracks.push(urlToAssets + audioExample);
  }
  if (isTextMeaningShow && audioMeaning) {
    tracks.push(urlToAssets + audioMeaning);
  }

  const audioPlay = () => {
    audioPromise = audioRef.current.play();
  };

  const audioPause = () => {
    if (audioPromise !== undefined) {
      audioPromise
        .then(() => {
          audioRef.current.pause();
        });
    } else {
      audioRef.current.pause();
    }
  };

  const handleAudioPlayBtnClick = () => {
    setCurrentTruck(0);
    setIsAudioPlay(true);
  };

  const onAudioEnded = () => {
    if (currentTruck < tracks.length - 1) {
      setCurrentTruck((truck) => truck + 1);
    } else {
      onAudioEnd();
    }
  };

  useEffect(() => {
    if (isAudioOn.audioOn) {
      setIsAudioPlay(true);
    } else {
      setIsAudioPlay(false);
    }

    setCurrentTruck(0);
  }, [isAudioOn]);

  useEffect(() => {
    let cancelled = false;

    setAudioData({
      loading: true,
      src: null,
      error: null,
    });

    fetch(tracks[currentTruck])
      .then((res) => res.blob())
      .then((blob) => {
        if (!cancelled) {
          setAudioData({
            loading: false,
            src: URL.createObjectURL(blob),
            error: null,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAudioData({
            loading: false,
            src: null,
            error: 'Sorry, we couldn\'t upload the audio',
          });
        }
      });

    return () => {
      cancelled = true;

      setAudioData({
        loading: false,
        src: null,
        error: null,
      });
    };
  }, [tracks[currentTruck]]);

  useEffect(() => {
    if (isAudioPlay && audioData.src) {
      audioPlay();
    } else if (audioData.error) {
      onAudioEnded();
    } else if (!isAudioPlay && audioRef.current) {
      audioPause();
    }
  }, [audioData, isAudioPlay]);

  const AudioPlayBtnEnabled = (isPrevWord && !audioData.loading)
    || (isCorrect && isComplexityBtn && !audioData.loading)
    || (isShowBtnClick && isComplexityBtn && !audioData.loading);

  return (
    <div className="card-controls__audio-btn">
      <Button
        id="speakWord"
        label="Speak"
        isDisabled={!AudioPlayBtnEnabled}
        clickHandler={handleAudioPlayBtnClick}
      />
      {audioData.loading && <Spinner />}
      <audio
        ref={audioRef}
        src={audioData.src}
        onEnded={onAudioEnded}
      />
    </div>
  );
};

export default AudioComponent;

AudioComponent.propTypes = {
  word: PropTypes.instanceOf(Word).isRequired,
  settings: PropTypes.shape({
    isComplexityBtn: PropTypes.bool.isRequired,
  }).isRequired,
  helpSettings: PropTypes.shape({
    isTextExampleShow: PropTypes.bool.isRequired,
    isTextMeaningShow: PropTypes.bool.isRequired,
  }).isRequired,
  isShowBtnClick: PropTypes.bool.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
  isAudioOn: PropTypes.shape({
    audioOn: PropTypes.bool.isRequired,
  }).isRequired,
  onAudioEnd: PropTypes.func.isRequired,
};
