import React from 'react';
import PropTypes from 'prop-types';

import './LinearProgressBar.scss';

const LinearProgressBar = ({ value, size }) => {
  const progress = Math.round((value / size) * 1000) / 10;

  return (
    <div className="linear-progress-bar__container">
      <div
        className="linear-progress-bar__track"
        data-size={size}
        data-value={value}
      >
        <div
          className="linear-progress-bar__thumb"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LinearProgressBar;

LinearProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};
