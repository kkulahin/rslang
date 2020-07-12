import React from 'react';
import ReactDom from 'react-dom';

import App from './app/App';
import 'semantic-ui-css/semantic.min.css';
import './styles/index.scss';

ReactDom.render(
  <App />,
  document.getElementById('root'),
);
