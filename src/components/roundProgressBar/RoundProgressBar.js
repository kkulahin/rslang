import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './RoundProgressBar.scss';

const RoundProgressBar = ({
  value,
  maxValue,
  size,
  innerPadding,
  thumbWidth,
  thumbColor,
}) => {
  const radius = (size - thumbWidth) / 2;
  const viewBox = `0 0 ${size} ${size}`;
  const dashArray = radius * Math.PI * 2;
  const ratio = maxValue === 0 ? 0 : value / maxValue;
  const innerRingSize = size - 2 * thumbWidth;
  const coreSize = size - 2 * (thumbWidth + innerPadding);

  const [stateRatio, setStateRatio] = useState(0);

  useEffect(() => {
    const updateProgressBar = () => {
      setTimeout(() => {
        setStateRatio(stateRatio + 0.001);
      }, 1);
    };
    if (stateRatio + 0.01 < ratio) {
      updateProgressBar();
    } else {
      setStateRatio(ratio);
    }
  }, [stateRatio, ratio]);

  const dashOffset = dashArray - dashArray * stateRatio;
  const percentage = stateRatio * 100;

  return (
    <div
      className="round-progress-bar__container"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
      >
        <circle
          fill="none"
          stroke={thumbColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dashArray}
          strokeDashoffset={-dashOffset}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={`${thumbWidth}px`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        className="round-progress-bar__inner-ring"
        style={{ width: `${innerRingSize}px`, height: `${innerRingSize}px` }}
      >
        <div
          className="round-progress-bar__core"
          style={{ width: `${coreSize}px`, height: `${coreSize}px` }}
        >
          {`${Math.floor(percentage)}%`}
        </div>
      </div>
    </div>
  );
};

RoundProgressBar.defaultProps = {
  maxValue: 100,
  size: 110,
  innerPadding: 10,
  thumbWidth: 10,
  thumbColor: '#25CEDE',
};

export default RoundProgressBar;

RoundProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number,
  size: PropTypes.number,
  innerPadding: PropTypes.number,
  thumbWidth: PropTypes.number,
  thumbColor: PropTypes.string,
};
