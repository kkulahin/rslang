import React from 'react';
import PropTypes from 'prop-types';

const AudioPlayIcon = ({ iconTitle }) => (
  <svg
    className="svg-icon"
    width="32"
    height="32"
    viewBox="41 41 430 430"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={iconTitle}
  >
    <title id={iconTitle}>Audio play icon</title>
    <g>
      <path
        className="st0"
        d="M385.1,254.3l-86.3-49.8v71.6c0,3.6-0.6,7.3-1.8,11c-1.1,3.6-2.9,
          7.2-5.3,10.7c-6.6,9.8-17.1,17.5-29.5,21.8c-6.8,2.4-13.7,3.6-20.6,3.6c-19.2,
          0-35-9.6-40.2-24.5c-4.7-13.5-0.1-28.6,12.1-40.4c6.1-6,14-10.7,22.6-13.7c4.1-1.4,8.3-2.4,
          12.5-3v-66l-55.6-32.1c-9.6-5.6-21.7,1.4-21.7,12.5v221.6c0,11.1,12,18.1,21.7,
          12.5l191.9-110.8C394.8,273.8,394.8,259.9,385.1,254.3z"
      />
      <path
        className="st1"
        d="M256,41C137.3,41,41,137.3,41,256s96.3,215,215,215s215-96.3,
          215-215S374.7,41,256,41z M256,435c-98.9,0-179-80.2-179-179S157.1,77,256,77s179,80.2,179,
          179S354.9,435,256,435z"
      />
      <path
        className="st2"
        d="M220.5,265.5c-9,8.7-13.1,19.9-9.6,29.9c5.4,15.5,26.9,22.1,48.1,
          14.8c10.7-3.7,19.3-10.3,24.5-17.9c1.8-2.6,3.2-5.4,4-8.2c0.9-2.6,1.3-5.3,
          1.3-7.9V154.6l11-1.2l30.8-3.3v-30.2l-41.9,4.5l-30,3.3v123.4c-6.1-0.3-12.7,0.7-19.3,
          3C232,256.6,225.5,260.6,220.5,265.5z"
      />
    </g>
  </svg>
);

AudioPlayIcon.defaultProps = {
  iconTitle: '',
};

export default AudioPlayIcon;

AudioPlayIcon.propTypes = {
  iconTitle: PropTypes.string,
};
