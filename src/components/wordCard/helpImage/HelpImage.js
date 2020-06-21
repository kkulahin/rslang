import React from 'react';
import PropTypes from 'prop-types';

const HelpImage = ({ helpSettings: { isHelpImage }, word: { image, wordTranslate } }) => {
	const element = (
		<div className='help-content__image'>
			<img src={image} alt={`image to ${wordTranslate}`}/>
		</div>
	);

	return (
		isHelpImage ? element : null
	);
}

export default HelpImage;

HelpImage.propTypes = {
	helpSettings: PropTypes.shape({
		isHelpImage: PropTypes.bool.isRequired,
	}),
	word: PropTypes.shape({
		wordTranslate: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
	}),
};
