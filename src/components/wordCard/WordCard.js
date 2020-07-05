import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';
import Word from '../../utils/spacedRepetition/Word';
// import WordQueue from "../../utils/spacedRepetition/WordQueue";

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
  // wordQueue,
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
  const { isAudioAuto, isComplexityBtn } = settings;
  const { definition: { word } } = currentWord;

  function reducer(state, action) {
    switch (action.type) {
      case 'resetWord':
        return initialState;
      case 'setState':
        return { ...state, ...action.payload };
      case 'handleAnswer':
        const newState = {
          value: '',
          isWordInput: true,
          isInputInFocus: { isFocus: false },
        };

        if (action.payload.isCorrectAnswer) {
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
    dispatch({ type: 'resetWord' });
    onPrevBtnClick();
  };

  const handleNavigateNextClick = () => {
    if (state.isCorrect || state.isShowBtnClick || isAnswered) {
      getNextWord();
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
    // onWordAnswered();
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

  const handleCardBtnClick = (id) => {
    const handlers = {
      deleteWord: onDeleteBtnClick,
      againWord: handleAgainBtnClick,
      showWord: handleShowBtnClick,
    };
    handlers[id]();
  };

  const createHandleKeydown = (actualState) => (evt) => {
    const { key } = evt;

    if (key === 'ArrowRight') {
      handleNavigateNextClick();
    } else if ((key === 'ArrowLeft')
        && hasPrevious
        && (!actualState.isCorrect && !actualState.isShowBtnClick && !isAnswered)) {
      handleNavigatePrevClick();
    }
  };

  useEffect(() => {
    const handleKeydown = createHandleKeydown(state);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [state]);

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
            isPrevWord={isAnswered} //----------------------------------
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

export default WordCard;

WordCard.propTypes = {
  // wordQueue: PropTypes.instanceOf(WordQueue).isRequired,
  currentWord: PropTypes.instanceOf(Word).isRequired,
  settings: PropTypes.shape({
    isAudioAuto: PropTypes.bool.isRequired,
    isComplexityBtn: PropTypes.bool.isRequired,
  }).isRequired,
  helpSettings: PropTypes.shape().isRequired,
  onAgainBtnClick: PropTypes.func.isRequired,
  onComplexityBtnClick: PropTypes.func.isRequired,
  onDeleteBtnClick: PropTypes.func.isRequired,
  onNextBtnClick: PropTypes.func.isRequired,
  onPrevBtnClick: PropTypes.func.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  isEducation: PropTypes.bool.isRequired,
  onWordAnswered: PropTypes.func.isRequired,
  onWordMistaken: PropTypes.func.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
};
