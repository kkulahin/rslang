import React from 'react';
// import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';

const helpSettings = {
	isHelpImage: true,
	isHelpTranscription: true,
	isHelpWordTranslate: true,
	isHelpTextMeaning: true,
	isHelpTextExample: true,
};

const word = {
	"word": "agree",
	"image": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg",
	"audio": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.mp3",
	"audioMeaning": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_meaning.mp3",
	"audioExample": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_example.mp3",
	"textMeaning": "To agree is to have the same opinion or belief as another person",
	"textExample": "The students agree they have too much homework",
	"transcription": "[əgríː]",
	"wordTranslate": "согласна",
	"textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
	"textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
	"id": 1,
};

const WordCard = () => {
	const handleNavigateClick = ({ id }) => {
		console.log(id);
	}

	return (
		<div className='card-unit'>
			<div className='card__container'>
				<NavigateBtn classes='prev' id='prev' onClick={handleNavigateClick}/>
				<ContainerWithShadow>
					<CardContent helpSettings={helpSettings} word={word}/>
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
	// word: PropTypes.object.isRequired,
	// helpSettings: PropTypes.object.isRequired,
};
