import React from 'react';
import PropTypes from 'prop-types';

import './NavigateBtn.scss';

const NavigateBtn = ({
  classes, id, onClick, isInvisible, isDisabled,
}) => {
  const btnClasses = isInvisible
    ? `navigate__btn ${classes} navigate__btn--invisible`
    : `navigate__btn ${classes}`;

  return (
    <div className="navigate">
      <button
        className={btnClasses}
        type="button"
        id={id}
        onClick={() => onClick({ id })}
        disabled={isDisabled}
      >
        <span className="navigate__icon" />
      </button>
    </div>
  );
};

NavigateBtn.defaultProps = {
  isInvisible: false,
  isDisabled: false,
};

export default NavigateBtn;

NavigateBtn.propTypes = {
  classes: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isInvisible: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
