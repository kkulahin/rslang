import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';
import './GreetingWrapper.scss';
import settingsController from '../../controllers/SettingsController';
import settingSubject from '../../utils/observers/SettingSubject';
import statisticsSubject from '../../utils/observers/StatisticsSubject';
import statisticsController from '../../controllers/StatisticsController';

const GreetingWrapper = () => {
  const [cardsCount, setCardCount] = useState(settingsController.getCardsCount());
  const [passedCount, setPassedCount] = useState(statisticsController.getPassedCount());

  const updateCardCount = () => {
    setCardCount(settingsController.getCardsCount());
  };

  const updatePassedCount = () => {
    setPassedCount(statisticsController.getPassedCount());
  };

  useEffect(() => {
    settingSubject.subscribe(updateCardCount);
    statisticsSubject.subscribe(updatePassedCount);

    return () => {
      settingSubject.unsubscribe(updateCardCount);
      statisticsSubject.unsubscribe(updatePassedCount);
    };
  }, []);

  const location = useLocation();

  const isAuthenticationPage = location.pathname === '/signin' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  return (
    !isAuthenticationPage
        && (
        <div className="greeting-wrapper">
          <Greeting />
          <ContinueTrainingBlock
            completedWordsCount={passedCount}
            cardsCount={cardsCount}
            isFullState={!isHomePage}
          />
        </div>
        )
  );
};

export default GreetingWrapper;
