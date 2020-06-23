import React, { useState } from 'react';
import ContainerWithShadow from '../../../components/containerWithShadow/ContainerWithShadow';
import CanvasJSReact from '../canvasjs.react';
import Dropdown from '../../../components/dropdown/Dropdown';

import './StatisticLong.scss';

const StatisticLong = () => {
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
      suffix: '',
    },
    axisX: {
      title: `day of ${statisticPeriod.substring(0, statisticPeriod.length - 2)}`,
      prefix: 'day ',
      interval: 1,
    },
    data: [{
      type: 'spline',
      toolTipContent: 'Day {x}: {y}',
      dataPoints: null,
    }],
  };
  if (statisticPeriod === 'Weekly') {
    options.data[0].dataPoints = [
      { x: 1, y: 10 },
      { x: 2, y: 15 },
      { x: 3, y: 30 },
      { x: 4, y: 20 },
      { x: 5, y: 50 },
      { x: 6, y: 25 },
      { x: 7, y: 40 },
    ];
  }
  if (statisticPeriod === 'Monthly') {
    options.data[0].dataPoints = [
      { x: 1, y: 10 },
      { x: 2, y: 15 },
      { x: 3, y: 30 },
      { x: 4, y: 20 },
      { x: 5, y: 50 },
      { x: 6, y: 25 },
      { x: 7, y: 40 },
      { x: 8, y: 32 },
      { x: 9, y: 68 },
      { x: 10, y: 45 },
      { x: 11, y: 55 },
      { x: 12, y: 12 },
      { x: 13, y: 43 },
      { x: 14, y: 36 },
      { x: 15, y: 37 },
      { x: 16, y: 21 },
      { x: 17, y: 11 },
      { x: 18, y: 22 },
      { x: 19, y: 33 },
      { x: 20, y: 51 },
      { x: 21, y: 29 },
      { x: 22, y: 23 },
      { x: 23, y: 41 },
      { x: 24, y: 32 },
      { x: 25, y: 45 },
      { x: 26, y: 62 },
      { x: 27, y: 14 },
      { x: 28, y: 19 },
      { x: 29, y: 52 },
      { x: 30, y: 32 },
    ];
  }

  return (
    <div className="statistic-long">
      <h3 className="statistic-long__title">Your statistics</h3>
      <div className="statistic-long__period">
        Word learned
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

export default StatisticLong;
