/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useEffect, useReducer, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';
import Word from '../../utils/spacedRepetition/Word';

const checkCorrect = ({ value, word }) => value.toLowerCase() === word.toLowerCase();

const initialState = {
  isWordInput: false,
  isInputInFocus: false,
  isCorrect: false,
  isShowBtnClick: false,
  isAgainBtnClick: false,
  isAudioOn: { audioOn: false },
  value: '',
  currentValue: '',
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

  const inputRef = useRef();

  function reducer(state, action) {
    const newState = {};

    switch (action.type) {
      case 'resetWord':
        return { ...initialState, isAudioOn: { audioOn: false } };
      case 'setState':
        return { ...state, ...action.payload };
      case 'handleAnswer':
        newState.value = '';
        newState.currentValue = state.value;
        newState.isWordInput = true;

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

  const handleAudioEnd = () => {
    if ((state.isCorrect || state.isShowBtnClick) && !isComplexityBtn) {
      dispatch({ type: 'resetWord' });
      onNextBtnClick();
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
      dispatch({ type: 'resetWord' });
      onPrevBtnClick();
    }
  };

  const handleNavigateNextClick = () => {
    if (state.isCorrect || state.isShowBtnClick || isAnswered || isEducation) {
      dispatch({ type: 'resetWord' });
      onNextBtnClick();
    } if (state.value === '') {
      inputRef.current.focus();
      dispatch({
        type: 'setState',
        payload: {
          isWordInput: false,
          isAudioOn: { audioOn: false },
        },
      });
    } else {
      inputRef.current.blur();
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

      if (val !== '') {
        inputRef.current.blur();
        dispatch({
          type: 'handleAnswer',
          payload: {
            isCorrect: checkCorrect({ value: val, word }),
          },
        });
      }
    }
  };

  const handleInputFocus = (isFocus) => {
    if (isFocus) {
      if (state.isWordInput) {
        dispatch({
          type: 'setState',
          payload: {
            isWordInput: false,
            isAudioOn: { audioOn: false },
            isInputInFocus: isFocus,
          },
        });
      }
    } else {
      dispatch({
        type: 'setState',
        payload: {
          isInputInFocus: isFocus,
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

    inputRef.current.blur();
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

  const handleCardBtnClick = (id) => {
    const handlers = {
      deleteWord: onDeleteBtnClick,
      againWord: handleAgainBtnClick,
      showWord: handleShowBtnClick,
    };
    handlers[id]();
  };

  const createHandleKeydown = useCallback(() => (evt) => {
    const { code } = evt;

    if ((code === 'ArrowRight')
        || (code === 'Enter'
            && (state.isCorrect || state.isShowBtnClick || isAnswered || isEducation))) {
      if (state.isCorrect || state.isShowBtnClick || isAnswered || isEducation) {
        dispatch({ type: 'resetWord' });
        onNextBtnClick();
      } if (state.value === '') {
        inputRef.current.focus();
        dispatch({
          type: 'setState',
          payload: {
            isWordInput: false,
            isAudioOn: { audioOn: false },
          },
        });
      } else {
        inputRef.current.blur();
        dispatch({
          type: 'handleAnswer',
          payload: {
            isCorrect: checkCorrect({ value: state.value, word }),
          },
        });
      }
    } else if (code === 'ArrowLeft') {
      if (hasPrevious
          && !state.isCorrect
          && !state.isShowBtnClick
          && !isAnswered) {
        dispatch({ type: 'resetWord' });
        onPrevBtnClick();
      }
    } else if (code !== 'Enter' && !state.isCorrect && !state.isShowBtnClick
                && !isAnswered && !isEducation
                && !state.isInputInFocus) {
      inputRef.current.focus();
      dispatch({
        type: 'setState',
        payload: {
          isWordInput: false,
          isAudioOn: { audioOn: false },
        },
      });
    }
  }, [state, word, hasPrevious, isAnswered, isEducation, onPrevBtnClick, onNextBtnClick]);

  useEffect(() => {
    const handleKeydown = createHandleKeydown();
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [createHandleKeydown]);

  useEffect(() => {
    inputRef.current.focus();
  }, [word, isAnswered]);

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
            word={currentWord.definition}
            onInputEnter={handleInputEnter}
            onInputFocus={handleInputFocus}
            onInputChange={handleInputChange}
            onCardBtnClick={handleCardBtnClick}
            onWordComplexityBtnClick={handleWordComplexityBtnClick}
            onAudioEnd={handleAudioEnd}
            isEducation={isEducation}
            wordDifficulty={wordDifficulty}
            isPrevWord={isAnswered}
            inputRef={inputRef}
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
