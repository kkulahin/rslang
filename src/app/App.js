// eslint-disable-next-line linebreak-style
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

import History from '../utils/history';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/loginPage/LoginPage';
import Logout from '../pages/logoutPage/Logout';
import SignupPage from '../pages/signupPage/SignupPage';
import Dictionary from '../pages/Dictionary';
import Statistic from '../pages/statistics/Statistic';
import Promo from '../pages/promoPage/Promo';
import About from '../pages/aboutPage/About';
import GamesPage from '../pages/gamesPage/GamesPage';
import Settings from '../pages/settingsPage/Settings';

import Header from '../components/header/Header';
import GreetingWrapper from '../components/greetingWrapper/GreetingWrapper';

import appDefaultSettings from '../config/defaultSettings';
import { getConfig, saveConfig } from '../controllers/appConfig/appConfig';
import settingQueueSubject from '../utils/observers/SettingQueueSubject';

import './App.scss';
import PrivateRoute from '../components/route/PrivateRoute';

const App = () => {
  const [settings, setSettings] = useState(appDefaultSettings);

  useEffect(() => {
    settingQueueSubject.subscribe(setSettings);

    getConfig();

    return () => settingQueueSubject.unsubscribe(setSettings);
  }, []);

  useEffect(() => {
    if (settings !== appDefaultSettings) {
      saveConfig(settings);
    }
  }, [settings]);

  const [cardSettings, educationSettings, buttonSettings] = settings;
  const [wordsCount, cardsCount] = educationSettings.settingsArr;

  return (
    <Router history={History}>
      <div className="app-wrapper">
        <Header />
        <div className="app-main">
          <GreetingWrapper
            cardsCount={cardsCount.value}
          />
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/signin" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/logout" component={Logout} />
            <PrivateRoute path="/dictionary" component={Dictionary} />
            <PrivateRoute path="/statistic" component={Statistic} />
            <PrivateRoute path="/settings">
              <Settings
                settings={settings}
                handleAppChange={(newSettings) => setSettings(newSettings)}
              />
            </PrivateRoute>
            <PrivateRoute path="/promo" component={Promo} />
            <PrivateRoute path="/about" component={About} />
            <PrivateRoute path="/games" component={GamesPage} />
            <PrivateRoute component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
