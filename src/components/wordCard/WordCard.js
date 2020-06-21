import React, { useState, useRef } from 'react';
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

const wordJSON = {
	"word": "agree",
	"image": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg",
	"audio": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.mp3",
	"audioMeaning": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_meaning.mp3",
	"audioExample": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_example.mp3",
	"textMeaning": "To <i>agree</i> is to have the same opinion or belief as another person",
	"textExample": "The students <b>agree</b> they have too much homework",
	"transcription": "[əgríː]",
	"wordTranslate": "согласна",
	"textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
	"textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
	"id": 1,
};

const checkCorrect = ({ value, word }) => {
	return value.toLowerCase() === word.toLowerCase();
}

const WordCard = () => {
	const inputRef = useRef();
	const [isWordInput, setIsWordInput] = useState(false);
	const [isCorrect, setIsCorrect] = useState(null);
	const [value, setValue] = useState('');

	const { word } = wordJSON;

	const handleInputChange = (evt) => {
		setValue(evt.target.value);
	}

	const handleNavigateClick = ({ id }) => {
		if (id === 'next') {
			const isCorrectValue = checkCorrect({ value, word });
			setValue('');
			setIsWordInput(true);
			setIsCorrect(isCorrectValue);
			inputRef.current.blur();
		}

		if (id === 'prev') {
			console.log(id);
		}
	}

	const handleInputEnter = (evt) => {
		const { value } = evt.target;
		const isCorrectValue = checkCorrect({ value, word });

		if (evt.key === 'Enter') {
			setValue('');
			setIsWordInput(true);
			setIsCorrect(isCorrectValue);
			inputRef.current.blur();
		}
	}

	const handleInputFocus = () => {
		if (isWordInput) {
			setIsWordInput(false);
		}
	}

	const handleShowBtnClick = () => {
		setValue('');
		setIsWordInput(true);
	}

	return (
		<div className='card-unit'>
			<div className='card__container'>
				<NavigateBtn classes='prev' id='prev' onClick={handleNavigateClick}/>
				<ContainerWithShadow>
					<CardContent
						helpSettings={helpSettings}
						word={wordJSON}
						onInputEnter={handleInputEnter}
						onInputFocus={handleInputFocus}
						onInputChange={handleInputChange}
						onShowBtnClick={handleShowBtnClick}
						inputRef={inputRef}
						value={value}
						isWordInput={isWordInput}
						isCorrect={isCorrect}
					/>
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
