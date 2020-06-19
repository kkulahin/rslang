import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss';

const Checkbox = ({ handleSwitch }) => <input type="checkbox" className="checkbox" onChange={handleSwitch} />;

Checkbox.propTypes = {
  handleSwitch: PropTypes.func.isRequired,
};

export default Checkbox;
