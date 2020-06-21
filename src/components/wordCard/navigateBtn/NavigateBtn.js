import React from 'react';
import PropTypes from 'prop-types';

import './NavigateBtn.scss';

const NavigateBtn = ({ classes, id, onClick }) => {
	return (
		<div className='navigate'>
			<button className={`navigate__btn ${classes}`}
				type='button'
				id={id}
				onClick={() => onClick({ id })}
			>
				<span className='navigate__icon' />
			</button>
		</div>
	);
}

export default NavigateBtn;

NavigateBtn.propTypes = {
	classes: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
