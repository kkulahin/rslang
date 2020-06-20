import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookie';

const Logout = () => {
  const [isRedirectToHome, setRedirect] = useState(false);
  const removetUser = () => {
    deleteCookie('auth');
    setRedirect(true);
  };
  return (
    <div>
      {isRedirectToHome ? <Redirect to="/" /> : removetUser()}
    </div>
  );
};

export default Logout;
