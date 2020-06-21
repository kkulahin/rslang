// eslint-disable-next-line linebreak-style
import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import History from './utils/history';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/loginPage/LoginPage';
import Logout from './pages/logoutPage/Logout';
import SignupPage from './pages/signupPage/SignupPage';
import Dictionary from './pages/Dictionary';
import Statistic from './pages/Statistic';
import Promo from './pages/Promo';
import About from './pages/About';
import Settings from './pages/Settings';
import GamesPage from './pages/gamesPage/GamesPage';

import Header from './components/header/Header';
import GreetingWrapper from './components/greetingWrapper/GreetingWrapper';

import './app.scss';

const App = () => (
  <Router history={History}>
    <div className="app-wrapper">
      <Header />
      <div className="app-main">
        <GreetingWrapper />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/logout" component={Logout} />
          <Route path="/dictionary" component={Dictionary} />
          <Route path="/statistic" component={Statistic} />
          <Route path="/settings" component={Settings} />
          <Route path="/promo" component={Promo} />
          <Route path="/about" component={About} />
          <Route path="/games" component={GamesPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
