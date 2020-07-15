import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookie';
import wordController from '../../controllers/WordConrtoller';
import settingsController from '../../controllers/SettingsController';
import statisticsController from '../../controllers/StatisticsController';

const Logout = ({ getLoginStatus, isUserOffline }) => {
  const [isRedirectToHome, setRedirect] = useState(false);
  const [isRemoveUser, setRemoveUser] = useState(false);

  const removeUser = () => {
    deleteCookie('auth');
    deleteCookie('login');
    wordController.reset();
    settingsController.reset();
    statisticsController.reset();
    if (!isRemoveUser) {
      setRemoveUser(true);
    }
  };

  useEffect(() => {
    if (isRemoveUser) {
      getLoginStatus(false);
    }
  }, [isRemoveUser, getLoginStatus]);

  useEffect(() => {
    if (!isUserOffline) {
      setRedirect(true);
    }
  }, [isUserOffline]);

  return (
    <div>
      {isRedirectToHome ? <Redirect to="/" /> : removeUser()}
    </div>
  );
};

Logout.propTypes = {
  getLoginStatus: PropTypes.func,
  isUserOffline: PropTypes.bool,
};

Logout.defaultProps = {
  getLoginStatus: () => {},
  isUserOffline: false,
};

export default Logout;
