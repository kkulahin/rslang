import React from 'react';
import { useAuth0 } from './Auth/auth0';

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button type="button" onClick={() => loginWithRedirect()}> Login </button>
  );
};

export default Login;
