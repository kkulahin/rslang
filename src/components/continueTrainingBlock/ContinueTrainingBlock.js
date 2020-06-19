import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RoundProgressBar from '../roundProgressBar/RoundProgressBar';
import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import Button from '../button/Button';

import './ContinueTrainingBlock.scss';

const ContinueTrainingBlock = ({ completedWordsCount, cardsCount, isFullState }) => {
  const button = isFullState && (
  <Button
    label="Continue"
    name="light"
  />
  );

  return (
    <ContainerWithShadow
      width="42%"
      height="160px"
      padding="0"
    >
      <div className="continue-training-block">
        <div className="continue-training-block__item">
          <h3>{`${completedWordsCount} out of ${cardsCount} words`}</h3>
          <p>you have learned today</p>
          <Link to="/">
            {button}
          </Link>
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
