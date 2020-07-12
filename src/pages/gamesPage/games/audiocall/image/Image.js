import React from 'react';
import PropTypes from 'prop-types';

import './Image.scss';

const Image = ({ src }) => (
  <img
    className="image"
    src={src}
    alt="voice"
  />
);

Image.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Image;
