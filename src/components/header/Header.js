import React from 'react';

// eslint-disable-next-line import/no-unresolved
import Nav from './navPanel/NavPanel';

const Header = () => (
  <Nav />
);

/*
const { isAuthenticated, logout } = useAuth0();

<div className="header-content">
{ isAuthenticated && <button type="button" className="ui button" onClick={() => logout()}> Logout </button>}
</div>
*/

export default Header;
