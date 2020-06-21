import React from 'react';
import { useLocation } from 'react-router-dom';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';

import './GreetingWrapper.scss';

const GreetingWrapper = () => {
  const location = useLocation();

  const isVisibleWrapper = () => location.pathname === '/signin' || location.pathname === '/signup';
  return (
    <>
      {
isVisibleWrapper() ? null : (
  <div className="greeting-wrapper">
    <div className="app-container">
      <Greeting className="app-greeting" />
      <ContinueTrainingBlock className="app-greeting__statistic" />
    </div>
  </div>
)
}
    </>
  );
};

export default GreetingWrapper;
