import React from 'react';
import ReactDom from 'react-dom';

import App from './app';
import 'semantic-ui-css/semantic.min.css';

ReactDom.render(
  // eslint-disable-next-line react/jsx-props-no-spreading
  <App />,
  document.getElementById('root'),
);
