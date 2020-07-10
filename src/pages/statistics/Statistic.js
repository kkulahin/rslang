import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import {
  useRouteMatch, Switch, Route, Link, useLocation,
} from 'react-router-dom';
import StatisticLong from './statisticLong/StatisticLong';
import StatisticShort from '../../components/statisticShort/StatisticShort';

import './Statistic.scss';
import statisticsController from '../../controllers/StatisticsController';
import statisticsSubject from '../../utils/observers/StatisticsSubject';

const Statistic = () => {
  const { path, url } = useRouteMatch();
  let location = useLocation();
  location = location.pathname.replace('/statistic', '').replace('/', '');
  let nextStatistics = 'short';
  if (location === 'short') {
    nextStatistics = 'long';
  }
  const [statistics, setStatistics] = useState(statisticsController.get());

  useEffect(() => {
    statisticsSubject.subscribe(setStatistics);

    return () => statisticsSubject.unsubscribe(setStatistics);
  }, [statistics]);

  return (
    <div className="statistic">
      <Switch>
        <Route exact path={`${path}`}>
          <StatisticLong statistics={statistics !== null ? statistics : undefined} />
        </Route>
        <Route path={`${path}/long`}>
          <StatisticLong statistics={statistics !== null ? statistics : undefined} />
        </Route>
        <Route path={`${path}/short`}>
          <StatisticShort statistics={statistics !== null ? statistics : undefined} />
        </Route>
      </Switch>
      <Link
        to={`${url}/${nextStatistics}`}
        className={`statistic__${nextStatistics === 'long' ? 'right' : 'left'}-arrow`}
      >
        <Icon
          name={`chevron ${nextStatistics === 'long' ? 'right' : 'left'}`}
          size="huge"
        />
      </Link>
    </div>
  );
};

export default Statistic;
