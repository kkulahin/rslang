/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Transition } from 'semantic-ui-react';
import { getCookie } from '../../../utils/cookie';

import Logo from '../../../assets/image/icon/reload.png';

import './navPanel.scss';

const NavPanel = () => {
  const [activeItem, setActiveItem] = useState({ link: '' });
  const [menuSize, setMenuSize] = useState({ size: 'min' });
  const [isVisible, setVisible] = useState(false);
  const handleItemClick = (e) => {
    const activeLink = e.target.getAttribute('name');
    setActiveItem({ link: activeLink });
  };

  const isMenuFullSize = () => menuSize.size === 'max';

  const changeMenuSize = (e) => {
    e.preventDefault();
    const size = menuSize.size === 'max' ? 'min' : 'max';
    setMenuSize({ size });
    setVisible(!isVisible);
  };

  const isUserAuth = () => {
    const auth = getCookie('auth');
    if (auth) {
      return (JSON.parse(auth))?.message === 'Authenticated';
    }
    return false;
  };

  return (
    <div className="vertical menu">
      <Menu className={`app-menu  ${menuSize.size}`} icon="labeled" vertical>
        <div className="logo-wrapper">
          <img src={Logo} alt="" />
        </div>
        <div className="app-link">
          <Link
            className={activeItem.link === 'home' ? 'item active' : 'item'}
            name="home"
            to="/"
            onClick={handleItemClick}
          >
            <Icon name="home" />
            {isMenuFullSize() ? (
              <Transition
                visible={isVisible}
                animation="scale"
                duration={3500}
              >
                <p>Home</p>
              </Transition>
            ) : null}
          </Link>
          <Link
            className={activeItem.link === 'dictionary' ? 'item active' : 'item'}
            name="dictionary"
            to="/dictionary"
            onClick={handleItemClick}
          >
            <Icon name="graduation cap" />
            {isMenuFullSize() ? <p>Learn</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'statistic' ? 'item active' : 'item'}
            name="statistic"
            to="/statistic"
            onClick={handleItemClick}
          >
            <Icon name="area chart" />
            {isMenuFullSize() ? <p>Chart</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'about' ? 'item active' : 'item'}
            name="about"
            to="/about"
            onClick={handleItemClick}
          >
            <Icon name="users" />
            {isMenuFullSize() ? <p>About</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'settings' ? 'item active' : 'item'}
            name="settings"
            to="/settings"
            onClick={handleItemClick}
          >
            <Icon name="settings" />
            {isMenuFullSize() ? <p>Settings</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'promo' ? 'item active' : 'item'}
            name="promo"
            to="/promo"
            onClick={handleItemClick}
          >
            <Icon name="caret square right outline" />
            {isMenuFullSize() ? <p>Promo</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'games' ? 'item active' : 'item'}
            name="games"
            to="/games"
            onClick={handleItemClick}
          >
            <Icon name="game" />
            {isMenuFullSize() ? <p>Games</p> : null}
          </Link>

        </div>

        <div className="app-menu__resize">
          <Link
            className={activeItem.link === 'promo' ? 'item active' : 'item'}
            name="size"
            onClick={changeMenuSize}
            to="/"
          >
            <Icon name={isMenuFullSize() ? 'angle double left' : 'angle double right'} />
            {isMenuFullSize() ? <p>Less</p> : null}
          </Link>
        </div>
        <div className="login">
          <Link
            className={activeItem.link === 'promo' ? 'item active' : 'item'}
            onClick={handleItemClick}
            name={isUserAuth() ? 'logout' : 'login'}
            to={isUserAuth() ? '/logout' : '/signin'}
          >
            <Icon name={isUserAuth() ? 'sign out' : 'sign in'} />
          </Link>
        </div>
      </Menu>

    </div>
  );
};

export default NavPanel;
