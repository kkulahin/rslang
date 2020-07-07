// eslint-disable-next-line linebreak-style
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

import History from '../utils/history';
import Home from '../pages/homePage/Home';
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
import './App.scss';
import PrivateRoute from '../components/route/PrivateRoute';

document.addEventListener('click', ({ target }) => {
  const isMobileDevice = window.innerWidth <= 767;
  const isLogo = target.alt === 'Logo';
  const isMenu = target.classList.contains('app-menu');
  const isResizeBtn = target.closest('.app-menu__resize');

  if (isMobileDevice && !(isLogo || isMenu || isResizeBtn)) {
    document.querySelector('.vertical.menu').classList.remove('opened');
  }
});

const App = () => (
  <Router history={History}>
    <div className="app-wrapper">
      <Header />
      <div className="app-main">
        <GreetingWrapper />
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route path="/signin" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/logout" component={Logout} />
          <PrivateRoute path="/dictionary" component={Dictionary} />
          <PrivateRoute path="/statistic" component={Statistic} />
          <PrivateRoute path="/settings" component={Settings} />
          <PrivateRoute path="/promo" component={Promo} />
          <PrivateRoute path="/about" component={About} />
          <PrivateRoute path="/games" component={GamesPage} />
          <PrivateRoute component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
