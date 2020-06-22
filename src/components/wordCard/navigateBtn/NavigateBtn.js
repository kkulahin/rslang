import React from 'react';
import PropTypes from 'prop-types';

import './NavigateBtn.scss';

const NavigateBtn = ({ classes, id, onClick, isInvisible }) => {
	let btnClasses = `navigate__btn ${classes}`;
	if (isInvisible) {
		btnClasses += ' navigate__btn--invisible';
	}

	return (
		<div className='navigate'>
			<button className={btnClasses}
				type='button'
				id={id}
				onClick={() => onClick({ id })}
			>
				<span className='navigate__icon' />
			</button>
		</div>
	);
}

NavigateBtn.defaultProps = {
	isInvisible: false,
};

export default NavigateBtn;

NavigateBtn.propTypes = {
	classes: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	isInvisible: PropTypes.bool,
};
