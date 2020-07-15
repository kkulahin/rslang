/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState, useRef, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';

import Button from '../button/Button';
import Spinner from '../spinner/Spinner';
import { urlToAssets } from '../../../constants/urls';
import AudioPlayIcon from '../icons/AudioPlayIcon';

const AudioComponent = (props) => {
  const {
    settings: {
      isComplexityBtn = true,
      isTextExampleShow = true,
      isTextMeaningShow = true,
    },
    word: {
      audio = '',
      audioExample = '',
      audioMeaning = '',
    },
    onAudioEnd,
    isPrevWord,
    isEducation,
    isCorrect,
    isShowBtnClick,
    isAudioOn,
  } = props;

  const audioRef = useRef();

  const [currentTrack, setCurrentTrack] = useState({ track: 0 });
  const [isAudioPlay, setIsAudioPlay] = useState(false);
  const [isAudioPause, setIsAudioPause] = useState(true);
  const [audioData, setAudioData] = useState({
    loading: true,
    src: null,
    error: null,
  });

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

  const handleAudioPlayBtnClick = () => {
    setCurrentTrack({ track: 0 });
    setIsAudioPlay(true);

    if (tracks.length === 1) {
      setIsAudioPause(false);
    }
  };

  const audioPlay = () => {
    audioRef.current.play();
  };

  const onAudioEnded = () => {
    setIsAudioPause(true);

    if (currentTrack.track < tracks.length - 1) {
      setCurrentTrack((current) => ({ track: current.track + 1 }));
    } else {
      setIsAudioPlay(false);
      onAudioEnd();
    }
  };

  useEffect(() => {
    if (isAudioOn.audioOn) {
      setIsAudioPlay(true);
    } else {
      setIsAudioPlay(false);
    }

    setCurrentTrack({ track: 0 });
  }, [isAudioOn]);

  const currentSrc = useMemo(() => tracks[currentTrack.track], [tracks, currentTrack]);
  useEffect(() => {
    let cancelled = false;

    setAudioData({
      loading: true,
      src: null,
      error: null,
    });

    fetch(currentSrc)
      .then((res) => res.blob())
      .then((blob) => {
        if (!cancelled) {
          setAudioData({
            loading: false,
            src: URL.createObjectURL(blob),
            error: null,
          });
          setIsAudioPause(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAudioData({
            loading: false,
            src: null,
            error: 'Sorry, we couldn\'t upload the audio',
          });
          setIsAudioPause(false);
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
  }, [currentSrc]);

  if (audioData.src && isAudioPlay && !isAudioPause) {
    audioPlay();
  } else if (audioData.error && isAudioPlay && !isAudioPause) {
    onAudioEnded();
  }

  const AudioPlayBtnEnabled = (isPrevWord && !audioData.loading)
    || (isEducation && !audioData.loading)
    || (isCorrect && isComplexityBtn && !audioData.loading)
    || (isShowBtnClick && isComplexityBtn && !audioData.loading);

  return (
    <div className="card-controls__audio-btn">
      <Button
        id="speakWord"
        dataTitle="Listen to the word"
        dataPlacement="top"
        isDisabled={!AudioPlayBtnEnabled}
        clickHandler={handleAudioPlayBtnClick}
        icon={<AudioPlayIcon iconTitle="audio play icon" />}
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

AudioComponent.defaultProps = {
  word: {},
  settings: {},
};

export default AudioComponent;

AudioComponent.propTypes = {
  word: PropTypes.shape({
    audio: PropTypes.string,
    audioExample: PropTypes.string,
    audioMeaning: PropTypes.string,
  }),
  settings: PropTypes.shape({
    isComplexityBtn: PropTypes.bool,
    isTextExampleShow: PropTypes.bool,
    isTextMeaningShow: PropTypes.bool,
  }),
  isShowBtnClick: PropTypes.bool.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
  isEducation: PropTypes.bool.isRequired,
  isAudioOn: PropTypes.shape({
    audioOn: PropTypes.bool.isRequired,
  }).isRequired,
  onAudioEnd: PropTypes.func.isRequired,
};
