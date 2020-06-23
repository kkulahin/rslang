import React from 'react';

import './StatisticShort.scss';

const StatisticShort = () => {
  const statisticData = {
    cardsCompleted: '50',
    correctAnswer: '75%',
    newWords: 46,
    longestStrike: 12,
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
              {statisticData.correctAnswer}
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

export default StatisticShort;
