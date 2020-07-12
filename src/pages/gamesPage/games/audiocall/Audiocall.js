import React, { useState } from 'react';
import MainWindow from './mainWindow/MainWindow';
import StatisticWindow from './statisticWindow/StatisticWindow';
import { urlToAssets as baseUrl } from '../../../../constants/urls';
import './Audiocall.scss';
import GreetingWindow from './greetingWindow/GreetingWindow';

const AudioCall = () => {
  // const baseUrl = 'https://raw.githubusercontent.com/irinainina/rslang-data/master/';
  const [showWindows, setShowWindows] = useState({
    greeting: true,
    main: false,
    statistic: false,
  });
  const [result, setResult] = useState(null);
  const [degree, setDegree] = useState(0);

  return (
    <div className="audiocall">
      {
        showWindows.greeting && (
          <GreetingWindow
            onComplete={
              (group, page) => {
                setDegree(30 * group + page);
                setShowWindows({
                  greeting: false,
                  main: true,
                  statistic: false,
                });
              }
            }
          />
        )
      }
      {
        showWindows.main && (
          <MainWindow
            baseUrl={baseUrl}
            degree={degree}
            onEndOfGame={
              (resultInner) => {
                setResult(resultInner);
                setShowWindows({
                  greeting: false,
                  main: false,
                  statistic: true,
                });
              }
            }
          />
        )
      }
      {
        showWindows.statistic && (
          <StatisticWindow
            gameStatistics={result}
            baseUrl={baseUrl}
            onClickButtonContinueGame={
              () => {
                setShowWindows({
                  greeting: false,
                  main: true,
                  statistic: false,
                });
                setDegree((s) => {
                  if (s >= 180) {
                    return s;
                  }
                  return s + 1;
                });
              }
            }
          />
        )
      }
    </div>
  );
};

export default AudioCall;
