import React from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';

const WordCard = (props) => {
	const { word } = props;

	const handleNavigateClick = ({ id }) => {
		console.log(id);
	}

	return (
		<div className='card-unit'>
			<div className='card__container'>
				<NavigateBtn classes='prev' id='prev' onClick={handleNavigateClick}/>
				<ContainerWithShadow>
					<CardContent word={word}/>
				</ContainerWithShadow>
				<NavigateBtn classes='next' id='next' onClick={handleNavigateClick}/>
			</div>
		</div>
	);
}

WordCard.defaultProps = {
	// children: null,
};

export default WordCard;

WordCard.propTypes = {
	props: PropTypes.any,
};
