import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropsType from 'prop-types';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';
import './GreetingWrapper.scss';
import settingsController from '../../controllers/SettingsController';
import settingSubject from '../../utils/observers/SettingSubject';

const GreetingWrapper = () => {
  const [cardsCount, setCardCount] = useState(settingsController.getCardsCount());

  const updateCardCount = () => {
    setCardCount(settingsController.getCardsCount());
  };

  useEffect(() => {
    settingSubject.subscribe(updateCardCount);
    if (settingsController.getConfig() === null) {
      settingsController.getConfigFromServer();
    }

    return () => settingSubject.unsubscribe(updateCardCount);
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
            cardsCount={cardsCount}
            isFullState={!isHomePage}
          />
        </div>
        )
  );
};

export default GreetingWrapper;
