import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';
import './GreetingWrapper.scss';
import statisticsSubject from '../../utils/observers/StatisticsSubject';
import statisticsController from '../../controllers/StatisticsController';
import wordQueueSubject from '../../utils/observers/WordQueueSubject';
import wordController from '../../controllers/WordConrtoller';
import { getCookie } from '../../utils/cookie';
import wordsReloadedSubject from '../../utils/observers/WordsReloadedSubject';

const GreetingWrapper = () => {
  const [cardsCount, setCardCount] = useState(wordController.getWordsCount());
  const [passedCount, setPassedCount] = useState(statisticsController.getPassedCount());
  const [userInfo, setUserInfo] = useState({ name: '' });

  const updateCardCount = () => {
    setCardCount(wordController.getWordsCount());
  };

  const updatePassedCount = () => {
    setPassedCount(statisticsController.getPassedCount());
  };

  useEffect(() => {
    wordQueueSubject.subscribe(updateCardCount);
    wordsReloadedSubject.subscribe(updateCardCount);
    statisticsSubject.subscribe(updatePassedCount);

    return () => {
      wordQueueSubject.unsubscribe(updateCardCount);
      wordsReloadedSubject.unsubscribe(updateCardCount);
      statisticsSubject.unsubscribe(updatePassedCount);
    };
  }, [setCardCount, setPassedCount]);

  useEffect(() => {
    const auth = JSON.parse(getCookie('auth'));
    if (Object.keys(auth).length > 0 && userInfo.name !== auth.name) {
      setUserInfo({ name: auth.name });
    }
  }, [userInfo.name]);

  const location = useLocation();

  const isAuthenticationPage = location.pathname === '/signin' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  let completedWordsCount = passedCount === null || cardsCount === null ? 0 : passedCount;
  if (completedWordsCount > cardsCount) {
    completedWordsCount = cardsCount;
  }

  return (
    !isAuthenticationPage
        && (
        <div className="greeting-wrapper">
          <Greeting userName={userInfo.name}/>
          <ContinueTrainingBlock
            completedWordsCount={completedWordsCount}
            cardsCount={passedCount === null || cardsCount === null ? 0 : cardsCount}
            isFullState={!isHomePage}
          />
        </div>
        )
  );
};

export default GreetingWrapper;
