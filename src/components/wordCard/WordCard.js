/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';
import Word from '../../utils/spacedRepetition/Word';

const checkCorrect = ({ value, word }) => value.toLowerCase() === word.toLowerCase();

const initialState = {
  isWordInput: false,
  isInputInFocus: { isFocus: true },
  isCorrect: false,
  isShowBtnClick: false,
  isAgainBtnClick: false,
  isAudioOn: { audioOn: false },
  value: '',
};

const WordCard = ({
  helpSettings,
  settings,
  currentWord,
  onShowAnswerBtnClick,
  onAgainBtnClick,
  onComplexityBtnClick,
  onDeleteBtnClick,
  onNextBtnClick,
  onPrevBtnClick,
  onWordAnswered,
  onWordMistaken,
  hasPrevious,
  isAnswered,
  isEducation,
  wordDifficulty,
}) => {
  const { isAudioAuto, isComplexityBtn } = settings;
  const { definition: { word } } = currentWord;

  function reducer(state, action) {
    const newState = {};

    switch (action.type) {
      case 'resetWord':
        return { ...initialState, isAudioOn: { audioOn: false }, isInputInFocus: { isFocus: true } };
      case 'resetWordToPrev':
        return { ...initialState, isAudioOn: { audioOn: false }, isInputInFocus: { isFocus: false } };
      case 'setState':
        return { ...state, ...action.payload };
      case 'handleAnswer':
        newState.value = '';
        newState.isWordInput = true;
        newState.isInputInFocus = { isFocus: false };

        if (action.payload.isCorrect) {
          newState.isCorrect = true;
          onWordAnswered();
        } else {
          onWordMistaken();
        }

        if (isAudioAuto) {
          newState.isAudioOn = { audioOn: true };
        }

        return { ...state, ...newState };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const getNextWord = () => {
    dispatch({ type: 'resetWord' });
    onNextBtnClick();
  };

  const handleAudioEnd = () => {
    if ((state.isCorrect || state.isShowBtnClick) && !isComplexityBtn) {
      getNextWord();
    }
  };

  const handleInputChange = (evt) => {
    dispatch({ type: 'setState', payload: { value: evt.target.value } });
  };

  const handleNavigatePrevClick = () => {
    if (hasPrevious
        && !state.isCorrect
        && !state.isShowBtnClick
        && !isAnswered) {
      dispatch({ type: 'resetWordToPrev' });
      onPrevBtnClick();
    }
  };

  const handleNavigateNextClick = () => {
    if (state.isCorrect || state.isShowBtnClick || isAnswered || isEducation) {
      if (isEducation) {
        onWordAnswered();
      }
      getNextWord();
    } else if (state.value === '') {
      dispatch({
        type: 'setState',
        payload: {
          isWordInput: false,
          isAudioOn: { audioOn: false },
          isInputInFocus: { isFocus: true },
        },
      });
    } else {
      dispatch({
        type: 'handleAnswer',
        payload: {
          isCorrect: checkCorrect({ value: state.value, word }),
        },
      });
    }
  };

  const handleInputEnter = (evt) => {
    if (evt.key === 'Enter') {
      const { value: val } = evt.target;
      dispatch({
        type: 'handleAnswer',
        payload: {
          isCorrect: checkCorrect({ value: val, word }),
        },
      });
    }
  };

  const handleInputFocus = () => {
    if (state.isWordInput) {
      dispatch({
        type: 'setState',
        payload: {
          isWordInput: false,
          isAudioOn: { audioOn: false },
        },
      });
    }
  };

  const handleShowBtnClick = () => {
    dispatch({
      type: 'setState',
      payload: {
        isShowBtnClick: true,
        isCorrect: true,
      },
    });
    dispatch({
      type: 'handleAnswer',
      payload: { isCorrect: false },
    });
    onShowAnswerBtnClick();
  };

  const handleWordComplexityBtnClick = (id) => {
    onComplexityBtnClick(id);
  };

  const handleAgainBtnClick = () => {
    dispatch({
      type: 'setState',
      payload: {
        isAgainBtnClick: true,
      },
    });
    onAgainBtnClick();
  };

  const handleCardBtnClick = (id, ...args) => {
    console.log(id);
    const handlers = {
      deleteWord: onDeleteBtnClick,
      undoDeleteWord: onDeleteBtnClick,
      againWord: handleAgainBtnClick,
      showWord: handleShowBtnClick,
    };
    console.log(handlers[id]);
    handlers[id](...args);
  };

  const handlePrevClick = useCallback(() => {
    if (hasPrevious
      && !state.isCorrect
      && !state.isShowBtnClick
      && !isAnswered) {
      dispatch({ type: 'resetWordToPrev' });
      onPrevBtnClick();
    }
  }, [state, hasPrevious, isAnswered, onPrevBtnClick]);

  const memoGetNextWord = useCallback(() => {
    dispatch({ type: 'resetWord' });
    onNextBtnClick();
  }, [onNextBtnClick]);

  const handleNextClick = useCallback(() => {
    if (state.isCorrect || state.isShowBtnClick || isAnswered || isEducation) {
      memoGetNextWord();
    } else if (state.value === '') {
      dispatch({
        type: 'setState',
        payload: {
          isWordInput: false,
          isAudioOn: { audioOn: false },
          isInputInFocus: { isFocus: true },
        },
      });
    } else {
      dispatch({
        type: 'handleAnswer',
        payload: {
          isCorrect: checkCorrect({ value: state.value, word }),
        },
      });
    }
  }, [state, isEducation, isAnswered, word, memoGetNextWord]);

  const createHandleKeydown = (handlePrev, handleNext) => (evt) => {
    const { key } = evt;

    if (key === 'ArrowRight') {
      handleNext();
    } else if (key === 'ArrowLeft') {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeydown = createHandleKeydown(handlePrevClick, handleNextClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handlePrevClick, handleNextClick]);

  return (
    <div className="card-unit">
      <div className="card__container">
        <NavigateBtn
          classes="prev"
          id="prev"
          onClick={handleNavigatePrevClick}
          isInvisible={!hasPrevious}
          isDisabled={state.isCorrect || state.isShowBtnClick || isAnswered}
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
            onAudioEnd={handleAudioEnd}
            isEducation={isEducation}
            wordDifficulty={wordDifficulty}
            isPrevWord={isAnswered}
            {...state}
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

WordCard.defaultProps = {
  onShowAnswerBtnClick: () => {},
  wordDifficulty: 'normal',
};

export default WordCard;

WordCard.propTypes = {
  currentWord: PropTypes.instanceOf(Word).isRequired,
  settings: PropTypes.shape({
    isAudioAuto: PropTypes.bool.isRequired,
    isComplexityBtn: PropTypes.bool.isRequired,
  }).isRequired,
  helpSettings: PropTypes.shape().isRequired,
  onShowAnswerBtnClick: PropTypes.func,
  onAgainBtnClick: PropTypes.func.isRequired,
  onComplexityBtnClick: PropTypes.func.isRequired,
  onDeleteBtnClick: PropTypes.func.isRequired,
  onNextBtnClick: PropTypes.func.isRequired,
  onPrevBtnClick: PropTypes.func.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  isEducation: PropTypes.bool.isRequired,
  wordDifficulty: PropTypes.string,
  onWordAnswered: PropTypes.func.isRequired,
  onWordMistaken: PropTypes.func.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
};
