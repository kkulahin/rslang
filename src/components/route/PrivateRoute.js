import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authService from '../../services/AuthService';
import signinSubject from '../../utils/observers/SignInSubject';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { auth, login } = authService.isLoggedIn();
  const [isLoggedIn, setLoggedIn] = useState(login);

  console.log(auth, login);

  useEffect(() => {
    console.log('mount');
    const updateLoggedIn = () => {
      const { login } = authService.isLoggedIn();
      setLoggedIn(login);
    };
    signinSubject.subscribe(updateLoggedIn);

    return () => {
      console.log('unmount');
      signinSubject.unsubscribe(updateLoggedIn);
    };
  });

  if (!auth) {
    console.log('try to log in');
    authService.tryLogIn().then(() => {
      'try log in end';
    });
  }

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
