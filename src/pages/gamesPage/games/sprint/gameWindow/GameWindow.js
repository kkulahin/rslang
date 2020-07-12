import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactCountdownClock from 'react-countdown-clock';
import { Progress } from 'semantic-ui-react';

import Button from '../../../../../components/button/Button';

import progressBarColors from '../../../../../constants/progressBarColors';
import { trueKey, falseKey } from '../../../../../constants/keyboardControl';

import './GameWindow.scss';

const GameWindow = ({
  round, checkResult, finishGame,
}) => {
  const [gameRound, setGameRound] = useState({
    currentScore: round.currentScore,
    rise: round.rise,
    winStreak: round.winStreak,
    word: round.word,
    translate: round.translate,
  });

  const [isPreparation, setIsPreparation] = useState(true);

  useEffect(() => {
    function checkResultBtn({ code }) {
      if (code === trueKey) {
        setGameRound(checkResult(true));
      } else if (code === falseKey) {
        setGameRound(checkResult(false));
      }
    }

    if (!isPreparation) {
      document.addEventListener('keypress', checkResultBtn);
    }

    return () => document.removeEventListener('keypress', checkResultBtn);
  }, [isPreparation, checkResult]);

  const [progressBarState, setProgressBarState] = useState({
    percent: 0,
    colorId: 0,
  });

  useEffect(() => {
    const { percent: oldPercentages, colorId: oldColorId } = progressBarState;
    const newPercentages = 25 * (gameRound.winStreak % 4);

    if (oldPercentages !== newPercentages) {
      const newColorId = (progressBarState.colorId + 1) % progressBarColors.length;
      const isNewWinStreakStage = gameRound.winStreak && !(gameRound.winStreak % 4);

      setProgressBarState({
        percent: newPercentages,
        colorId: isNewWinStreakStage ? newColorId : oldColorId,
      });
    }
  }, [gameRound.winStreak]);

  const gameWindowContent = (isPreparation)
    ? (
      <ReactCountdownClock
        seconds={5}
        color="#25cede"
        alpha={0.9}
        weight={40}
        showMilliseconds={false}
        size={300}
        onComplete={() => setIsPreparation(false)}
      />
    )
    : (
      <div className="game-window">
        <div className="game-window__header">
          <div className="game-window__header__score">
            Your score:
            {' '}
            {gameRound.currentScore}
          </div>
          <div className="game-window__header__round-points">
            <Progress
              percent={progressBarState.percent}
              color={progressBarColors[progressBarState.colorId]}
            />
            Stage points:
            {'  +'}
            {gameRound.rise}
          </div>
        </div>
        <div className="game-window__body">
          <div className="game-window__body__round-info">
            {gameRound.word.toLowerCase()}
            <br />
            {gameRound.translate}
          </div>
          <ReactCountdownClock
            seconds={60}
            color="#25cede"
            alpha={0.9}
            weight={10}
            showMilliseconds={false}
            size={100}
            onComplete={finishGame}
          />
        </div>
        <div className="game-window__footer">
          <Button
            name="check"
            label="TRUE"
            id="true-answer"
            clickHandler={() => setGameRound(checkResult(true))}
          />
          <Button
            name="check"
            label="FALSE"
            id="false-answer"
            clickHandler={() => setGameRound(checkResult(false))}
          />
        </div>
      </div>
    );

  return (
    <>
      {gameWindowContent}
    </>
  );
};

GameWindow.propTypes = {
  round: PropTypes.shape({
    currentScore: PropTypes.number,
    rise: PropTypes.number,
    winStreak: PropTypes.number,
    word: PropTypes.string,
    translate: PropTypes.string,
  }).isRequired,
  checkResult: PropTypes.func.isRequired,
  finishGame: PropTypes.func.isRequired,
};

export default GameWindow;
