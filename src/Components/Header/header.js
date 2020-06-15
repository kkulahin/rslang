import React from 'react';
import { useAuth0 } from '../Auth/auth0';

const Header = () => {
  const { isAuthenticated, logout } = useAuth0();
  return (
    <div className="header-content">
      { isAuthenticated && <button type="button" className="ui button" onClick={() => logout()}> Logout </button>}
    </div>
  );
};

export default Header;
