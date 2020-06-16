/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React from 'react';
import { useAuth0 } from './components/auth/auth0';
import Login from './components/login/login';

const AuthRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated } = useAuth0();
  console.log(isAuthenticated, 'auth');
  // eslint-disable-next-line react/jsx-props-no-spreading
  return isAuthenticated === true ? <Component {...rest} /> : <Login />;
};

export default AuthRoute;
