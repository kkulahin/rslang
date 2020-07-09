import React from 'react';
import PropTypes from 'prop-types';

const ShowAnswerIcon = ({ iconTitle }) => (
  <svg
    className="svg-icon"
    width="26"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={iconTitle}
  >
    <title id={iconTitle}>Show answer icon</title>
    <g>
      <path d="M20,24H4c-2.2,0-4-1.8-4-4V4c0-2.2,1.8-4,4-4h16c2.2,0,4,1.8,4,4v16C24,22.2,22.2,24,20,
        24z M4,2C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2H4z"
      />
      <path d="M23,9H1C0.4,9,0,8.6,0,8s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,9,23,9z" />
      <path
        className="path-1"
        d="M12,18c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,
        1.4,0s0.4,1,0,1.4l-3,3C12.5,17.9,12.3,18,12,18z"
      />
      <path
        className="path-1"
        d="M12,18c-0.3,0-0.5-0.1-0.7-0.3l-3-3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3,
        3c0.4,0.4,0.4,1,0,1.4C12.5,17.9,12.3,18,12,18z"
      />
    </g>
  </svg>
);

ShowAnswerIcon.defaultProps = {
  iconTitle: '',
};

export default ShowAnswerIcon;

ShowAnswerIcon.propTypes = {
  iconTitle: PropTypes.string,
};
