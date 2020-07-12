import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookie';
import wordController from '../../controllers/WordConrtoller';
import settingsController from '../../controllers/SettingsController';
import statisticsController from '../../controllers/StatisticsController';

const Logout = () => {
  const [isRedirectToHome, setRedirect] = useState(false);
  const removeUser = () => {
    deleteCookie('auth');
    deleteCookie('login');
    wordController.reset();
    settingsController.reset();
    statisticsController.reset();
    setRedirect(true);
  };
  return (
    <div>
      {isRedirectToHome ? <Redirect to="/" /> : removeUser()}
    </div>
  );
};

export default Logout;
