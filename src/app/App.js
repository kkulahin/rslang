// eslint-disable-next-line linebreak-style
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

import History from '../utils/history';
import Home from '../pages/homePage/Home';
import NotFound from '../pages/notFoundPage/NotFound';
import LoginPage from '../pages/loginPage/LoginPage';
import Logout from '../pages/logoutPage/Logout';
import SignupPage from '../pages/signupPage/SignupPage';
import Dictionary from '../pages/dictionaryPage/Dictionary';
import Statistic from '../pages/statistics/Statistic';
import Promo from '../pages/promoPage/Promo';
import About from '../pages/aboutPage/About';
import GamesPage from '../pages/gamesPage/GamesPage';
import Settings from '../pages/settingsPage/Settings';

import Header from '../components/header/Header';
import Modal from '../components/modal/Modal';
import GreetingWrapper from '../components/greetingWrapper/GreetingWrapper';
import './App.scss';
import PrivateRoute from '../components/route/PrivateRoute';
import notificationSubject from '../utils/observers/NotificationSubject';

document.addEventListener('click', ({ target }) => {
  const isMobileDevice = window.innerWidth <= 767;
  const isLogo = target.alt === 'Logo';
  const isMenu = target.classList.contains('app-menu');
  const isResizeBtn = target.closest('.app-menu__resize');

  if (isMobileDevice && !(isLogo || isMenu || isResizeBtn)) {
    document.querySelector('.vertical.menu').classList.remove('opened');
  }
});

const App = () => {
  const [isUserLogin, setUserLogin] = useState(false);
  const [notification, setNotification] = useState(null);

  const getLoginStatus = (status) => {
    setUserLogin(status);
  };

  useEffect(() => {
    notificationSubject.subscribe(setNotification);

    return () => {
      notificationSubject.unsubscribe(setNotification);
    };
  }, [setNotification]);

  return (
    <Router history={History}>
      <div className="app-wrapper">
        <Header />
        <div className="app-main">
          <GreetingWrapper userOnline={isUserLogin} />
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/signin">
              <LoginPage getLoginStatus={getLoginStatus} isUserOnline={isUserLogin} />
            </Route>
            <Route path="/signup" component={SignupPage} isUserOffline={isUserLogin} />
            <Route path="/logout">
              <Logout getLoginStatus={getLoginStatus} />
            </Route>
            <PrivateRoute path="/dictionary" component={Dictionary} />
            <PrivateRoute path="/statistic" component={Statistic} />
            <PrivateRoute path="/settings" component={Settings} />
            <Route path="/promo" component={Promo} />
            <PrivateRoute path="/about" component={About} />
            <PrivateRoute path="/games" component={GamesPage} />
            <PrivateRoute component={NotFound} />
          </Switch>
        </div>
        { notification
          ? (
            <Modal
              content={notification.message}
              contentHeader={notification.title}
              clickHandler={() => setNotification(null)}
            />
          ) : null }
      </div>
    </Router>
  );
};

export default App;
