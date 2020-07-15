import React from 'react';
import PropTypes from 'prop-types';

import './ContainerWithShadow.scss';

const ContainerWithShadow = ({
  children, width, height, padding, clName,
}) => (
  <div
    className={`container-with-shadow ${clName}`}
    style={{ width, height, padding }}
  >
    {children}
  </div>
);

ContainerWithShadow.defaultProps = {
  width: 'auto',
  height: 'auto',
  padding: '40px',
  children: null,
  clName: '',
};

export default ContainerWithShadow;

ContainerWithShadow.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  padding: PropTypes.string,
  children: PropTypes.node,
  clName: PropTypes.string,
};
