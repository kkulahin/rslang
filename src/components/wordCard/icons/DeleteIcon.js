import React from 'react';
import PropTypes from 'prop-types';

const DeleteIcon = ({ iconTitle }) => (
  <svg
    className="svg-icon"
    width="24"
    height="20"
    viewBox="0 0.5 23 22"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={iconTitle}
  >
    <title id={iconTitle}>Delete icon</title>
    <g>
      <polygon
        className="polygon-1"
        points="16.947,0.42 5.019,0.42 0,4.908 0,22.502 9.1,22.502 9.1,20.924 1.778,20.924 1.778,6.628
            6.927,6.628 6.927,1.998 15.17,1.998 15.17,9.981 16.947,9.981"
      />
      <polygon
        className="polygon-2"
        points="16.433,13.266 20.212,9.486 22.957,12.231 19.178,16.01 22.957,19.794 20.212,22.538
            16.433,18.759 12.649,22.538 9.905,19.794 13.685,16.01 9.905,12.231 12.649,9.486"
      />
    </g>
  </svg>
);

DeleteIcon.defaultProps = {
  iconTitle: '',
};

export default DeleteIcon;

DeleteIcon.propTypes = {
  iconTitle: PropTypes.string,
};
