import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import History from '../utils/history';
import Home from './route/Home';
import NotFound from './route/NotFound';
import LoginPage from './route/LoginPage';
import Dictionary from './route/Dictionary';
import Statistic from './route/Statistic';
import Promo from './route/Promo';
import About from './route/About';
/* import AuthRoute from './authRoute'; */

import Header from './header/Header';

import './app.scss';

const App = () => (
  <Router history={History}>
    <Header />
    <Switch>
      <Route path="/signin">
        <LoginPage />
      </Route>
      <Route path="/dictionary">
        <Dictionary />
      </Route>
      <Route path="/statistic" component={Statistic} />
      <Route path="/promo" component={Promo} />
      <Route path="/about" component={About} />
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

export default App;
