import React, { useState } from 'react';
import MainWindow from './mainWindow/MainWindow';
import StatisticWindow from './statisticWindow/StatisticWindow';
import './Audiocall.scss';

const AudioCall = () => {
  const baseUrl = 'https://raw.githubusercontent.com/irinainina/rslang-data/master/';
  const [showWindows, setShowWindows] = useState({
    main: true,
    statistic: false,
  });
  const [result, setResult] = useState(null);
  const [degree, setDegree] = useState(0);

  return (
    <div className="audiocall">
      {
        showWindows.main && (
          <MainWindow
            baseUrl={baseUrl}
            degree={degree}
            onEndOfGame={
              (resultInner) => {
                setResult(resultInner);
                setShowWindows({
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
