import React from 'react';
import PropTypes from 'prop-types';

const HelpPicture = ({ isHelpPicture, src, word }) => {
	const element = (
		<div className='help-content__picture'>
			<img src={src} alt={`picture to ${word}`}/>
		</div>
	);

	return (
		isHelpPicture ? element : null
	);
}

export default HelpPicture;

HelpPicture.propTypes = {
	word: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	isHelpPicture: PropTypes.bool.isRequired,
};
