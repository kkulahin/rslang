import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';
import Word from '../../utils/spacedRepetition/Word';
import WordQueue from '../../utils/spacedRepetition/WordQueue';
import { urlToAssets } from '../../constants/urls';

const checkCorrect = ({ value, word }) => value.toLowerCase() === word.toLowerCase();

/**
 *
 * @param {Object} params
 * @param {WordQueue} params.wordQueue
 */
const WordCard = ({
  wordQueue,
  helpSettings,
  settings,
  currentWord,
  onErrorAnswer,
  onAgainBtnClick,
  // onHardBtnClick,
  onComplexityBtnClick,
  onDeleteBtnClick,
  onNextBtnClick,
  onPrevBtnClick,
  isAnswered,
  isEducation,
  onWordAnswered,
  onWordMistaken,
  hasPrevious,
}) => {
  const [isWordInput, setIsWordInput] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShowBtnClick, setIsShowBtnClick] = useState(false);
  const [value, setValue] = useState('');
  const [isPrevWord, setIsPrevWord] = useState(false);

  const { isTextExampleShow, isTextMeaningShow } = helpSettings;
  const { isAudioAuto, isComplexityBtn } = settings;

  const inputRef = useRef();
  const audioRef = useRef();

  const {
    word, audio, audioExample, audioMeaning,
  } = currentWord.definition;

  let isAudioSrcLoading = false;
  let currentTruck = 0;
  const tracks = [urlToAssets + audio];
  if (isTextExampleShow) {
    tracks.push(urlToAssets + audioExample);
  }
  if (isTextMeaningShow) {
    tracks.push(urlToAssets + audioMeaning);
  }

  const audioPlay = () => {
    if (currentTruck !== 0) {
      audioRef.current.pause();
      currentTruck = 0;
      audioRef.current.src = tracks[currentTruck];
    }
    audioRef.current.play();
  };

  const handleAnswer = (isCorrectAnswer) => {
    if (isAudioAuto) {
      audioPlay();
    }
    setValue('');
    setIsWordInput(true);
    inputRef.current.blur();

    if (isCorrectAnswer) {
      setIsCorrect(true);
    } else {
      onErrorAnswer();
    }
  };

  const resetWord = () => {
    setIsWordInput(false);
    setIsCorrect(false);
    setIsShowBtnClick(false);
    setValue('');
  };

  const getNextWord = () => {
    console.log('----- get next word ----');
    resetWord();
    onNextBtnClick();
  };

  const onAudioEnded = () => {
    if (currentTruck < tracks.length - 1) {
      currentTruck += 1;
      audioRef.current.src = tracks[currentTruck];
      audioRef.current.play();
      return;
    }

    if ((isCorrect || isShowBtnClick) && !isComplexityBtn) {
      getNextWord();
    }
  };

  const onAudioLoadStart = () => {
    isAudioSrcLoading = true;
  };

  const onCanPlayThrough = () => {
    isAudioSrcLoading = false;
  };

  const handleInputChange = (evt) => {
    setValue(evt.target.value);
  };

  const handleNavigatePrevClick = () => {
    resetWord();
    onPrevBtnClick();
  };

  const handleNavigateNextClick = () => {
    if (isCorrect || isShowBtnClick || isAnswered) {
      getNextWord();
      return;
    }

    handleAnswer(checkCorrect({ value, word }));
  };

  const handleInputEnter = (evt) => {
    if (evt.key === 'Enter') {
      const { value: val } = evt.target;
      handleAnswer(checkCorrect({ value: val, word }));
    }
  };

  const handleInputFocus = () => {
    if (isWordInput) {
      setIsWordInput(false);
      audioRef.current.pause();
    }
  };

  const handleShowBtnClick = () => {
    setIsShowBtnClick(true);
    setIsCorrect(true);
    handleAnswer(false);
  };

  const handleAudioPlayBtnClick = () => {
    if (!isAudioSrcLoading) {
      audioPlay();
    }
  };

  const handleWordComplexityBtnClick = (id) => {
    onComplexityBtnClick(id);
  };

  const handleCardBtnClick = (id) => {
    const handlers = {
      deleteWord: onDeleteBtnClick,
      againWord: onAgainBtnClick,
      speakWord: handleAudioPlayBtnClick,
      showWord: handleShowBtnClick,
    };

    handlers[id]();
  };

  // const cardContentProps = {
  //   helpSettings,
  //   settings,
  //   word: currentWord,
  //   onInputEnter: handleInputEnter,
  //   onInputFocus: handleInputFocus,
  //   onInputChange: handleInputChange,
  //   onCardBtnClick: handleCardBtnClick,
  //   onWordComplexityBtnClick: handleWordComplexityBtnClick,
  //   inputRef,
  //   value,
  //   isShowBtnClick,
  //   isWordInput,
  //   isCorrect,
  //   isPrevWord,
  // };

  return (
    <div className="card-unit">
      <div className="card__container">
        <NavigateBtn
          classes="prev"
          id="prev"
          onClick={handleNavigatePrevClick}
          isInvisible={!hasPrevious}
          isDisabled={isCorrect || isShowBtnClick}
        />
        <ContainerWithShadow padding="20px">
          <CardContent
            helpSettings={helpSettings}
            settings={settings}
            word={currentWord}
            onInputEnter={handleInputEnter}
            onInputFocus={handleInputFocus}
            onInputChange={handleInputChange}
            onCardBtnClick={handleCardBtnClick}
            onWordComplexityBtnClick={handleWordComplexityBtnClick}
            inputRef={inputRef}
            value={value}
            isShowBtnClick={isShowBtnClick}
            isWordInput={isWordInput}
            isCorrect={isCorrect}
            isPrevWord={isAnswered}
          />
        </ContainerWithShadow>
        <NavigateBtn classes="next" id="next" onClick={handleNavigateNextClick} />
        <audio
          ref={audioRef}
          src={tracks[0]}
          onEnded={onAudioEnded}
          onLoadStart={onAudioLoadStart}
          onCanPlayThrough={onCanPlayThrough}
        />
      </div>
    </div>
  );
};

export default WordCard;

WordCard.propTypes = {
  wordQueue: PropTypes.instanceOf(WordQueue).isRequired,
  currentWord: PropTypes.instanceOf(Word).isRequired,
  settings: PropTypes.shape({
    isAudioAuto: PropTypes.bool.isRequired,
  }).isRequired,
  helpSettings: PropTypes.shape({
    isTextExampleShow: PropTypes.bool.isRequired,
    isTextMeaningShow: PropTypes.bool.isRequired,
  }).isRequired,
  onErrorAnswer: PropTypes.func.isRequired,
  onAgainBtnClick: PropTypes.func.isRequired,
  onComplexityBtnClick: PropTypes.func.isRequired,
  onDeleteBtnClick: PropTypes.func.isRequired,
  onNextBtnClick: PropTypes.func.isRequired,
  onPrevBtnClick: PropTypes.func.isRequired,
  isEducation: PropTypes.bool.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  onWordAnswered: PropTypes.func.isRequired,
  onWordMistaken: PropTypes.func.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
};
