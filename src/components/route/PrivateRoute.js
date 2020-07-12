import React, { useEffect, useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { AuthService } from '../../utils/responseFromServer';
import signinSubject from '../../utils/observers/SignInSubject';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();

  useEffect(() => history.listen((location) => {
  }), [history]);
  const { auth, login } = AuthService.isLoggedIn();
  const [isLoggedIn, setLoggedIn] = useState(login);

  useEffect(() => {
    if (!auth) {
      AuthService.tryLogIn().then(() => {
        'try log in end';
      });
    }
    const updateLoggedIn = () => {
      const { login: l } = AuthService.isLoggedIn();
      setLoggedIn(l);
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
