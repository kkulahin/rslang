import React from 'react';
import PropTypes from 'prop-types';

const RepeatIcon = ({ iconTitle }) => (
  <svg
    className="svg-icon"
    width="20"
    height="20"
    viewBox="2 2 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={iconTitle}
  >
    <title id={iconTitle}>Repeat icon</title>
    <path
      d="M10.414 19l1.293 1.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414
          1.414L10.414 17H15a5 5 0 0 0 3.727-8.333 1 1 0 0 1 1.49-1.334A7 7 0 0 1 15
          19h-4.586zm3.172-14l-1.293-1.293a1 1 0 1 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0
          1 1-1.414-1.414L13.586 7H9a5 5 0 0 0-3.727 8.333 1 1 0 0 1-1.49 1.334A7 7 0 0 1 9 5h4.586z"
      fillRule="nonzero"
    />
  </svg>
);

RepeatIcon.defaultProps = {
  iconTitle: '',
};

export default RepeatIcon;

RepeatIcon.propTypes = {
  iconTitle: PropTypes.string,
};
