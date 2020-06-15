import React from 'react';
import ReactDom from 'react-dom';

import App from './components/app';
import 'semantic-ui-css/semantic.min.css';

import { Auth0Provider } from './components/auth/auth0';
import auth0config from './components/config';

ReactDom.render(
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Auth0Provider {...auth0config}>
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);
