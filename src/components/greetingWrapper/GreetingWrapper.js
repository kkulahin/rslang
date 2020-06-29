import React from 'react';
import { useLocation } from 'react-router-dom';
import PropsType from 'prop-types';
import Greeting from '../greeting/Greeting';
import ContinueTrainingBlock from '../continueTrainingBlock/ContinueTrainingBlock';

import './GreetingWrapper.scss';

const GreetingWrapper = ({ cardsCount }) => {
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

GreetingWrapper.propTypes = {
  cardsCount: PropsType.number.isRequired,
};

export default GreetingWrapper;
