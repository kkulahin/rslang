import React from 'react';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';

import './GreetingWrapper.scss';

const GreetingWrapper = () => (
  <div className="greeting-wrapper">
    <div className="app-container">
      <Greeting className="app-greeting" />
      <ContinueTrainingBlock className="app-greeting__statistic" />
    </div>
  </div>
);

export default GreetingWrapper;
