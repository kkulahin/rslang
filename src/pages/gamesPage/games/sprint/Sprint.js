import React, { useState } from 'react';

import StartGame from './startGame/StartGame';
import GameWindow from './gameWindow/GameWindow';
import GameResult from './gameResult/GameResult';

import getRandomInt from '../../../../utils/random';

import '../../../../assets/audio/true.mp3';
import '../../../../assets/audio/false.mp3';

import './Sprint.scss';

const game = {
  wordsStorage: [],
  gameStatistics: {
    rightAnswers: 0,
    errorAnswers: 0,
    winStreak: 0,
    maxWinStreak: 0,
  },
  scoreInfo: {
    score: 0,
    rise: 10,
  },
  roundInfo: {
    word: null,
    translate: null,
    answer: null,
  },
  gameSounds: {
    trueAnswer: new Audio(),
    falseAnswer: new Audio(),
  },

  init() {
    this.wordsStorage = [];

    this.gameSounds.trueAnswer.src = '../audio/true.mp3';
    this.gameSounds.falseAnswer.src = '../audio/false.mp3';

    this.gameStatistics.rightAnswers = 0;
    this.gameStatistics.errorAnswers = 0;
    this.gameStatistics.winStreak = 0;
    this.gameStatistics.maxWinStreak = 0;

    this.roundInfo.word = null;
    this.roundInfo.translate = null;
    this.roundInfo.answer = null;

    this.scoreInfo.score = 0;
    this.scoreInfo.rise = 10;
  },

  getRound() {
    const roundWordId = getRandomInt(0, this.wordsStorage.length);

    this.roundInfo.word = this.wordsStorage[roundWordId].word;
    this.roundInfo.translate = (Math.random() > 0.5)
      ? this.wordsStorage[getRandomInt(0, this.wordsStorage.length)].translate
      : this.wordsStorage[roundWordId].translate;
    this.roundInfo.answer = this.roundInfo.translate === this.wordsStorage[roundWordId].translate;

    return {
      currentScore: this.scoreInfo.score,
      rise: this.scoreInfo.rise,
      winStreak: this.gameStatistics.winStreak,
      maxWinStreak: this.gameStatistics.maxWinStreak,
      word: this.roundInfo.word,
      translate: this.roundInfo.translate,
    };
  },

  checkResult(userAnswer) {
    const isSuccessfulRound = userAnswer === this.roundInfo.answer;

    if (isSuccessfulRound) {
      this.gameStatistics.rightAnswers += 1;
      this.gameStatistics.winStreak += 1;
      this.gameStatistics.maxWinStreak = (this.gameStatistics.winStreak > this.gameStatistics.maxWinStreak)
        ? this.gameStatistics.winStreak
        : this.gameStatistics.maxWinStreak;

      const isNewRoundStage = !(this.gameStatistics.winStreak % 4);
      this.scoreInfo.rise *= isNewRoundStage ? 2 : 1;
      this.scoreInfo.score += this.scoreInfo.rise;
    } else {
      this.gameStatistics.errorAnswers += 1;
      this.gameStatistics.winStreak = 0;

      this.scoreInfo.rise = 10;
    }

    this.gameSounds[`${isSuccessfulRound}Answer`].currentTime = 0;
    this.gameSounds[`${isSuccessfulRound}Answer`].play();

    return this.getRound();
  },
};

const Sprint = () => {
  const [visibilityElements, setVisibilityElements] = useState({
    startWindow: true,
    gameWindow: false,
    resultWindow: false,
  });

  return (
    <>
      {visibilityElements.startWindow && (
        <StartGame
          startGame={(words) => {
            game.init();
            game.wordsStorage.push(...words);

            setVisibilityElements({
              startWindow: false,
              gameWindow: true,
              resultWindow: false,
            });
          }}
        />
      )}
      {visibilityElements.gameWindow && (
        <GameWindow
          round={game.getRound()}
          checkResult={(userAnswer) => game.checkResult(userAnswer)}
          finishGame={() => setVisibilityElements({
            startWindow: false,
            gameWindow: false,
            resultWindow: true,
          })}
        />
      )}
      {visibilityElements.resultWindow && (
      <GameResult
        score={game.scoreInfo.score}
        rightAnswers={game.gameStatistics.rightAnswers}
        errorAnswers={game.gameStatistics.errorAnswers}
        winStreak={game.gameStatistics.maxWinStreak}
        closeGame={() => setVisibilityElements({
          startWindow: true,
          gameWindow: false,
          resultWindow: false,
        })}
      />
      )}
    </>
  );
};

export default Sprint;
