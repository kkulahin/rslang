import React from 'react';
import { Link } from 'react-router-dom';

import ContainerWithShadow from '../../components/containerWithShadow/ContainerWithShadow';

import './NotFound.scss';

const NotFound = () => (
  <ContainerWithShadow clName="notFound-page">
    <div className="notFound__content">
      <p>
        <span className="notFound__content--marked">404</span>
        {' '}
        page not found
      </p>
      <p>Sorry, this page does not exist.</p>
      <p>
        {'Try to go back to the '}
        <Link
          name="home"
          to="/"
        >
          <span className="notFound__content--link">home</span>
        </Link>
        {' page'}
      </p>
    </div>
  </ContainerWithShadow>
);

export default NotFound;
