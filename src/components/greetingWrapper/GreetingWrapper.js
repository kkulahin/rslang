import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';
import './GreetingWrapper.scss';
import settingsController from '../../controllers/SettingsController';
import statisticsSubject from '../../utils/observers/StatisticsSubject';
import statisticsController from '../../controllers/StatisticsController';
import wordQueueSubject from '../../utils/observers/WordQueueSubject';
import wordController from '../../controllers/WordConrtoller';

const GreetingWrapper = () => {
  const [cardsCount, setCardCount] = useState(settingsController.getCardsCount());
  const [passedCount, setPassedCount] = useState(statisticsController.getPassedCount());

  const updateCardCount = () => {
    setCardCount(wordController.getWordsCount());
  };

  const updatePassedCount = () => {
    setPassedCount(statisticsController.getPassedCount());
  };

  useEffect(() => {
    wordQueueSubject.subscribe(updateCardCount);
    statisticsSubject.subscribe(updatePassedCount);

    return () => {
      wordQueueSubject.unsubscribe(updateCardCount);
      statisticsSubject.unsubscribe(updatePassedCount);
    };
  }, [setCardCount, setPassedCount]);

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
