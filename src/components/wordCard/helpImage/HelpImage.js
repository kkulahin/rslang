import React from 'react';
import PropTypes from 'prop-types';

const HelpImage = ({ helpSettings: { isImageShow }, word: { image, wordTranslate } }) => {
	const element = (
		<div className='help-content__image'>
			<img src={image} alt={`image to ${wordTranslate}`}/>
		</div>
	);

	return (
		isImageShow ? element : null
	);
}

export default HelpImage;

HelpImage.propTypes = {
	helpSettings: PropTypes.shape({
		isImageShow: PropTypes.bool.isRequired,
	}),
	word: PropTypes.shape({
		wordTranslate: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
	}),
};
