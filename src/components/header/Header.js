import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './navPanel/NavPanel';

const Header = () => {
  const location = useLocation();

  const isVisibleMenu = () => location.pathname === '/signin' || location.pathname === '/signup';
  return (
    <div className="menu-wrapper">
      { isVisibleMenu() ? null : <Nav />}
    </div>
  );
};

export default Header;
