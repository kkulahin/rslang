import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';
import Word from '../../utils/spacedRepetition/Word';
import WordQueue from '../../utils/spacedRepetition/WordQueue';
// import { urlToAssets } from '../../constants/urls';

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
  onAgainBtnClick,
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
  const [isAgainBtnClick, setIsAgainBtnClick] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState({ audioOn: false });
  const [value, setValue] = useState('');

  const { isAudioAuto } = settings;
  const { definition: { word } } = currentWord;

  const inputRef = useRef();

  const handleAnswer = (isCorrectAnswer) => {
    setValue('');
    setIsWordInput(true);
    inputRef.current.blur();

    if (isCorrectAnswer) {
			setIsCorrect(true);
			onWordAnswered();
    } else {
      onWordMistaken();
		}
		
		if (isAudioAuto) {
			setIsAudioOn({ audioOn: true });
    }
  };

  const resetWord = () => {
    setIsWordInput(false);
    setIsCorrect(false);
		setIsShowBtnClick(false);
		setIsAgainBtnClick(false);
		setIsAudioOn({ audioOn: false });
    setValue('');
  };

  const getNextWord = () => {
    resetWord();
    onNextBtnClick();
  };

  // const onAudioEnded = () => {
  //   if ((isCorrect || isShowBtnClick) && !isComplexityBtn) {
  //     getNextWord();
  //   }
  // };

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
      const { value } = evt.target;
      handleAnswer(checkCorrect({ value, word }));
    }
  };

  const handleInputFocus = () => {
    if (isWordInput) {
      setIsWordInput(false);
			setIsAudioOn({ audioOn: false });
    }
  };

  const handleShowBtnClick = () => {
    setIsShowBtnClick(true);
		handleAnswer(false);
		onWordAnswered();
    setIsCorrect(true);
  };

  const handleWordComplexityBtnClick = (id) => {
    onComplexityBtnClick(id);
	};

  const handleAgainBtnClick = () => {
		setIsAgainBtnClick(true);
    onAgainBtnClick();
  };

  const handleCardBtnClick = (id) => {
    const handlers = {
      deleteWord: onDeleteBtnClick,
      againWord: handleAgainBtnClick,
      showWord: handleShowBtnClick,
    };

    handlers[id]();
  };

  return (
    <div className="card-unit">
      <div className="card__container">
        <NavigateBtn
          classes="prev"
          id="prev"
          onClick={handleNavigatePrevClick}
          isInvisible={!hasPrevious}
          isDisabled={isCorrect || isShowBtnClick || isAnswered}
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
            isAgainBtnClick={isAgainBtnClick}
            isWordInput={isWordInput}
            isCorrect={isCorrect}
						isPrevWord={isAnswered}
						isAudioOn={isAudioOn}
          />
        </ContainerWithShadow>
        <NavigateBtn
					classes="next"
					id="next"
					onClick={handleNavigateNextClick}
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
