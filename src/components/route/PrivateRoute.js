import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authService from '../../services/AuthService';
import signinSubject from '../../utils/observers/SignInSubject';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { auth, login } = authService.isLoggedIn();
  const [isLoggedIn, setLoggedIn] = useState(login);

  useEffect(() => {
    if (!auth) {
      authService.tryLogIn().then(() => {
        'try log in end';
      });
    }
    const updateLoggedIn = () => {
      const { login } = authService.isLoggedIn();
      setLoggedIn(login);
    };
    signinSubject.subscribe(updateLoggedIn);

    return () => {
      signinSubject.unsubscribe(updateLoggedIn);
    };
  });

  return (
    <Route
      {...rest}
      render={(props) => ((isLoggedIn) ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
      ))}
    />
  );
};

export default PrivateRoute;
