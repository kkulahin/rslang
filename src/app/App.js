// eslint-disable-next-line linebreak-style
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch,
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
import WordController from '../utils/spacedRepetition/WordConrtoller';

import appDefaultSettings from '../config/defaultSettings';
import { getConfig, saveConfig } from '../controllers/appConfig/appConfig';
import settingQueueSubject from '../utils/observers/SettingQueueSubject';

import './App.scss';

const App = () => {
  const wordController = new WordController();
  wordController.init();

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
            <Route exact path="/" render={() => <Home wordController={wordController} />} />
            <Route path="/signin" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/logout" component={Logout} />
            <Route path="/dictionary" component={Dictionary} />
            <Route path="/statistic" component={Statistic} />
            <Route path="/settings">
              <Settings
                settings={settings}
                handleAppChange={(newSettings) => setSettings(newSettings)}
              />
            </Route>
            <Route path="/promo" component={Promo} />
            <Route path="/about" component={About} />
            <Route path="/games" component={GamesPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
