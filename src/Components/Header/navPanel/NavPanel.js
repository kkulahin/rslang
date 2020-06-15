import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react';

import './navPanel.scss';

const NavPanel = () => {
  const [activeItem, setActiveItem] = useState({ link: '' });

  useEffect(() => {

  }, [activeItem]);

  const handleItemClick = (e) => {
    const activeLink = e.target.getAttribute('name');
    setActiveItem({ link: activeLink });
  };

  return (
    <Segment inverted className="header__wrapper">
      <Menu className="header__nav" inverted pointing secondary>
        <Link
          className={activeItem.link === 'home' ? 'item active' : 'item'}
          name="home"
          to="/"
          onClick={handleItemClick}
        >
          {' '}
          Main page
        </Link>
        <Link
          className={activeItem.link === 'dictionary' ? 'item active' : 'item'}
          name="dictionary"
          to="/dictionary"
          onClick={handleItemClick}
        >
          {' '}
          Dictionary
        </Link>
        <Link
          className={activeItem.link === 'statistic' ? 'item active' : 'item'}
          name="statistic"
          to="/statistic"
          onClick={handleItemClick}
        >
          {' '}
          Statistic
        </Link>
        <Link
          className={activeItem.link === 'promo' ? 'item active' : 'item'}
          name="promo"
          to="/promo"
          onClick={handleItemClick}
        >
          {' '}
          Promo
        </Link>
        <Link
          className={activeItem.link === 'about' ? 'item active' : 'item'}
          name="about"
          to="/about"
          onClick={handleItemClick}
        >
          {' '}
          About
        </Link>
      </Menu>
      <div>
        <Link to="/signin">
          <button className="ui button" type="button">
            {' '}
            Login
          </button>
        </Link>
      </div>
    </Segment>
  );
};

export default NavPanel;
