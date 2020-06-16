import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import History from './utils/history';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import Dictionary from './pages/Dictionary';
import Statistic from './pages/Statistic';
import Promo from './pages/Promo';
import About from './pages/About';
/* import AuthRoute from './authRoute'; */

import Header from './components/header/Header';

import './app.scss';

const App = () => (
  <Router history={History}>
    <div className="app-wrapper">
      <Header />
      <div className="app-main">
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
      </div>
    </div>
  </Router>
);

export default App;
