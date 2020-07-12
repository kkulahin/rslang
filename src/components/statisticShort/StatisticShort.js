import React from 'react';
import PropTypes from 'prop-types';

import './StatisticShort.scss';

const StatisticShort = ({ statistics }) => {
  const { optional: { todayStatistics } } = statistics;
  const statisticData = {
    cardsCompleted: todayStatistics.passedCards,
    correctAnswer: todayStatistics.correctAnswers > 0
      ? Math.ceil((todayStatistics.correctAnswers
        / (todayStatistics.correctAnswers + todayStatistics.incorrectAnswers)) * 100) : 0,
    newWords: todayStatistics.newWords,
    longestStrike: todayStatistics.strike,
  };

  return (
    <div className="statistic-short">
      <table className="statistic-short__table">
        <thead className="statistic-short__table-header">
          <tr>
            <td>Session completed</td>
          </tr>
        </thead>
        <tbody>
          <tr className="statistic-short__table-row">
            <td className="statistic-short__table-item">
              Cards completed
            </td>
            <td className="statistic-short__table-item">
              {statisticData.cardsCompleted}
            </td>
          </tr>

          <tr className="statistic-short__table-row">
            <td className="statistic-short__table-item">
              Correct answers
            </td>
            <td className="statistic-short__table-item">
              {`${statisticData.correctAnswer}%`}
            </td>
          </tr>

          <tr className="statistic-short__table-row">
            <td className="statistic-short__table-item">
              New words
            </td>
            <td className="statistic-short__table-item">
              {statisticData.newWords}
            </td>
          </tr>

          <tr className="statistic-short__table-row">
            <td className="statistic-short__table-item">
              Longest strike
            </td>
            <td className="statistic-short__table-item">
              {statisticData.longestStrike}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

StatisticShort.defaultProps = {
  statistics: {
    learnedWords: 0,
    optional: {
      todayStatistics: {
        newWords: 0,
        passedCards: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        strike: 0,
      },
    },
  },
};

StatisticShort.propTypes = {
  statistics: PropTypes.shape({
    learnedWords: PropTypes.number.isRequired,
    optional: PropTypes.shape({
      todayStatistics: PropTypes.shape({
        newWords: PropTypes.number,
        passedCards: PropTypes.number,
        correctAnswers: PropTypes.number,
        incorrectAnswers: PropTypes.number,
        strike: PropTypes.number,
      }),
    }),
  }),
};

export default StatisticShort;
