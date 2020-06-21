import React from 'react';
import PropTypes from 'prop-types';

import HelpPicture from '../helpPicture/HelpPicture';

const CardContent = (props) => {
	const { word } = props;

	return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpPicture isHelpPicture={true} src='https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg' word={word}/>
				<div className='help-content__text'>{word}</div>
			</div>
			<div className='learn-content'>
				{word}
			</div>
		</div>
	);
}

CardContent.defaultProps = {
	// children: null,
};

export default CardContent;

CardContent.propTypes = {
	props: PropTypes.any,
};
