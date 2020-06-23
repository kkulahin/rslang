import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import StatisticLong from './statisticLong/StatisticLong';
import StatisticShort from '../../components/statisticShort/StatisticShort';

import './Statistic.scss';

const Statistic = () => {
  const [statisticType, setStatisticType] = useState('short');

  const content = statisticType === 'short'
    ? (
      <>
        <StatisticShort />
        <Icon
          name="chevron right"
          size="huge"
          className="statistic__right-arrow"
          onClick={() => { setStatisticType('long'); }}
        />
      </>
    )
    : (
      <>
        <Icon
          name="chevron left"
          size="huge"
          className="statistic__left-arrow"
          onClick={() => { setStatisticType('short'); }}
        />
        <StatisticLong />
      </>
    );

  return (
    <div className="statistic">
      { content }
    </div>
  );
};

export default Statistic;
