import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContainerWithShadow from '../../../components/containerWithShadow/ContainerWithShadow';
import CanvasJSReact from '../canvasjs.react';
import Dropdown from '../../../components/dropdown/Dropdown';

import './StatisticLong.scss';

const StatisticLong = ({ statistics }) => {
  const { optional: { longStatistics } } = statistics;
  const [statisticPeriod, setStatisticPeriod] = useState('Weekly');
  const periods = ['Weekly', 'Monthly'];

  const { CanvasJS, CanvasJSChart } = CanvasJSReact;

  CanvasJS.addColorSet('rslang', [
    '#25CEDE',
  ]);

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: 'dark1', // "light2", "light1", "dark1", "dark2"
    colorSet: 'rslang',
    title: {
      text: `${statisticPeriod} learned words`,
    },
    axisY: {
      title: 'Word Count',
      includeZero: false,
      valueFormatString: '#,###',
    },
    axisX: {
      title: `day of the ${statisticPeriod.substring(0, statisticPeriod.length - 2)}`,
      valueFormatString: 'MMM DD',
      interval: 1,
      intervalType: 'day',
    },
    data: [{
      type: 'spline',
      toolTipContent: 'Day {x}: {y}',
      dataPoints: null,
    }],
  };

  const updateChart = (interval, period) => {
    options.axisX.interval = interval;
    let datesArray = Object.keys(longStatistics).map((daySec) => {
      const seconds = parseInt(daySec, 10);
      const day = new Date(seconds * 1000);
      return { date: day, count: longStatistics[daySec] };
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - period);
    datesArray = datesArray.filter((day) => day.date >= today && day.count > 0);
    options.data[0].dataPoints = datesArray.map((day) => ({ x: day.date, y: day.count }));
  };

  if (statisticPeriod === 'Weekly') {
    updateChart(1, 7);
  }
  if (statisticPeriod === 'Monthly') {
    updateChart(4, 30);
  }

  return (
    <div className="statistic-long">
      <h3 className="statistic-long__title">Your statistics</h3>
      <div className="statistic-long__period">
        Words learned
        <Dropdown
          values={periods}
          defaultValue="0"
          onChange={(numberOfPeriod) => setStatisticPeriod(periods[numberOfPeriod])}
        />
      </div>
      <ContainerWithShadow>
        <CanvasJSChart options={options} />
      </ContainerWithShadow>
    </div>
  );
};

StatisticLong.defaultProps = {
  statistics: {
    learnedWords: 0,
    optional: {
      longStatistics: {},
    },
  },
};

StatisticLong.propTypes = {
  statistics: PropTypes.shape({
    learnedWords: PropTypes.number.isRequired,
    optional: PropTypes.shape({
      longStatistics: PropTypes.shape({
        key: PropTypes.number,
      }),
    }),
  }),
};

export default StatisticLong;
