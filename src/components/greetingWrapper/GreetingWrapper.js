import React from 'react';
import { useLocation } from 'react-router-dom';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';

import './GreetingWrapper.scss';

const GreetingWrapper = () => {
  const location = useLocation();

  const isAuthenticationPage = location.pathname === '/signin' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  return (
    !isAuthenticationPage
        && (
        <div className="greeting-wrapper">
          <Greeting />
          <ContinueTrainingBlock
            isFullState={!isHomePage}
          />
        </div>
        )
  );
};

export default GreetingWrapper;
