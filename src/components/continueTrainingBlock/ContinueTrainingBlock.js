import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RoundProgressBar from '../roundProgressBar/RoundProgressBar';
import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import Button from '../button/Button';

import './ContinueTrainingBlock.scss';

const ContinueTrainingBlock = ({ completedWordsCount, cardsCount, isFullState }) => {
  const buttonLabel = cardsCount === 0 && completedWordsCount === 0 ? 'Update' : 'Continue';
  const label = cardsCount === 0 && completedWordsCount === 0
    ? (<h2>Your queue has not been created yet</h2>)
    : (
      <>
        <h3>{`${completedWordsCount} out of ${cardsCount} words`}</h3>
        <p>you have learned today</p>
      </>
    );
  return (
    <ContainerWithShadow
      clName="container-with-shadow--training"
    >
      <div className="continue-training-block">
        <div className="continue-training-block__item">
          {label}
          {isFullState && (
            <Link to="/">
              <Button
                label={buttonLabel}
                name="light"
                id="continue-training-btn"
              />
            </Link>
          )}
        </div>
        <RoundProgressBar
          value={completedWordsCount}
          maxValue={cardsCount}
        />
      </div>
    </ContainerWithShadow>
  );
};

ContinueTrainingBlock.propTypes = {
  isFullState: PropTypes.bool,
  completedWordsCount: PropTypes.number,
  cardsCount: PropTypes.number,
};

ContinueTrainingBlock.defaultProps = {
  isFullState: false,
  completedWordsCount: 0,
  cardsCount: 1,
};

export default ContinueTrainingBlock;
