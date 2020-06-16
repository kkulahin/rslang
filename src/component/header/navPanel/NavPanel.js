/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

import Logo from '../../../image/icon/reload.png';

import './navPanel.scss';

const NavPanel = () => {
  const [activeItem, setActiveItem] = useState({ link: '' });
  const handleItemClick = (e) => {
    const activeLink = e.target.getAttribute('name');
    setActiveItem({ link: activeLink });
  };
  return (
    <div className="vertical menu">
      <div className="logo-wrapper">
        <img src={Logo} alt="" />
      </div>
      <Menu icon="labeled" vertical>
        <Link
          className={activeItem.link === 'home' ? 'item active' : 'item'}
          name="home"
          to="/"
          onClick={handleItemClick}
        >
          <Icon name="home" />
          Main
        </Link>
        <Link
          className={activeItem.link === 'dictionary' ? 'item active' : 'item'}
          name="dictionary"
          to="/dictionary"
          onClick={handleItemClick}
        >
          <Icon name="graduation cap" />
          Learn
        </Link>
        <Link
          className={activeItem.link === 'statistic' ? 'item active' : 'item'}
          name="statistic"
          to="/statistic"
          onClick={handleItemClick}
        >
          <Icon name="area chart" />
          Chart
        </Link>
        <Link
          className={activeItem.link === 'about' ? 'item active' : 'item'}
          name="about"
          to="/about"
          onClick={handleItemClick}
        >
          <Icon name="users" />
          About
        </Link>
        <Link
          className={activeItem.link === 'promo' ? 'item active' : 'item'}
          name="promo"
          to="/promo"
          onClick={handleItemClick}
        >
          <Icon name="settings" />
          Settings
        </Link>
      </Menu>

      <div className="login">
        <Link to="/signin">
          <button type="button" className="ui icon button">
            <i className="icon angle double right" />
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NavPanel;
