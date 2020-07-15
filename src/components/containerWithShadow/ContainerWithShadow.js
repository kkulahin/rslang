import React from 'react';
import PropTypes from 'prop-types';

import './ContainerWithShadow.scss';

const ContainerWithShadow = ({
  children, clName,
}) => (
  <div
    className={`container-with-shadow ${clName}`}
  >
    {children}
  </div>
);

ContainerWithShadow.defaultProps = {
  children: null,
  clName: '',
};

export default ContainerWithShadow;

ContainerWithShadow.propTypes = {
  children: PropTypes.node,
  clName: PropTypes.string,
};
