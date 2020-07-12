import React from 'react';
import PropTypes from 'prop-types';

const NavigateNextIcon = ({ iconTitle }) => (
  <svg
    className="svg-icon"
    width="30"
    height="48"
    viewBox="0 0 30 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={iconTitle}
  >
    <title id={iconTitle}>Navigate icon</title>
    <path d="M5.99998 0L0.359985 5.64L18.68 24L0.359985 42.36L5.99998 48L30 24L5.99998 0Z" />
  </svg>
);

NavigateNextIcon.defaultProps = {
  iconTitle: '',
};

export default NavigateNextIcon;

NavigateNextIcon.propTypes = {
  iconTitle: PropTypes.string,
};
