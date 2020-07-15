import React from 'react';
import PropsType from 'prop-types';
import { Link } from 'react-router-dom';

import ContainerWithShadow from '../../../../../components/containerWithShadow/ContainerWithShadow';
import Button from '../../../../../components/button/Button';

import './GameResult.scss';

const GameResult = ({
  score, rightAnswers, errorAnswers, winStreak,
}) => (
  <ContainerWithShadow clName="container-with-shadow--sprint">
    <p className="game-result__score">
      Your score:
      {' '}
      {score}
    </p>
    <p className="game-result__right-answers">
      Right answers:
      {' '}
      {rightAnswers}
    </p>
    <p className="game-result__error-answers">
      Error answers:
      {' '}
      {errorAnswers}
    </p>
    <p className="game-result__win-streak">
      Max win streak:
      {' '}
      {winStreak}
    </p>
    <Link
      to="/games"
    >
      <Button
        name="check"
        label="OK"
        id="return-btn"
      />
    </Link>
  </ContainerWithShadow>
);

GameResult.propTypes = {
  score: PropsType.number.isRequired,
  rightAnswers: PropsType.number.isRequired,
  errorAnswers: PropsType.number.isRequired,
  winStreak: PropsType.number.isRequired,
};

export default GameResult;
