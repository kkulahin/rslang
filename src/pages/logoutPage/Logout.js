import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookie';

const Logout = () => {
  const [isRedirectToHome, setRedirect] = useState(false);
  const removeUser = () => {
    deleteCookie('auth');
    deleteCookie('login');
    setRedirect(true);
  };
  return (
    <div>
      {isRedirectToHome ? <Redirect to="/" /> : removeUser()}
    </div>
  );
};

export default Logout;
