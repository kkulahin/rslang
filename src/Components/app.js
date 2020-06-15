import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import History from '../Utils/history';
import Home from './Route/home';
import NotFound from './Route/notFound';
import AuthRoute from './authRoute';

import Header from './Header/header';

import './app.scss';

const App = () => (
  <Router history={History}>
    <Header />
    <Switch>
      <AuthRoute path="/" component={Home} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
