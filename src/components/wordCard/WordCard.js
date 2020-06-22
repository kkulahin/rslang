import React, { useState, useRef } from 'react';
// import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';

const helpSettings = {
	isImageShow: true,
	isTranscriptionShow: true,
	isWordTranslateShow: true,
	isTextExampleShow: true,
	isTextMeaningShow: true,
	isTranslateShow: true,
};

const settings = {
	isShowAnswerBtn: true,
	isDeleteBtn: true,
	isHardBtn: true,
	isAudioAuto: true,
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
	const { word, audio, audioExample, audioMeaning } = wordJSON;
	const { isTextExampleShow, isTextMeaningShow } = helpSettings;
	const { isAudioAuto } = settings;

	const [isWordInput, setIsWordInput] = useState(false);
	const [isCorrect, setIsCorrect] = useState(null);
	const [value, setValue] = useState('');
	const [isAudioPlay, setIsAudioPlay] = useState(false);

	const inputRef = useRef();
	const audioRef = useRef();

	const tracks = [];
	if (isTextExampleShow) {
		tracks.push(audioExample);
	}
	if (isTextMeaningShow) {
		tracks.push(audioMeaning);
	}

	let currentTruck = 0;
	const onAudioEnded = () => {
		if (currentTruck < tracks.length) {
			audioRef.current.src = tracks[currentTruck];
			audioRef.current.play();
			currentTruck += 1;
		} else {
			setIsAudioPlay(false);
		}
	}

	const handleInputChange = (evt) => {
		setValue(evt.target.value);
	}

	const handleNavigateClick = ({ id }) => {
		if (id === 'next') {
			setValue('');
			setIsWordInput(true);
			setIsCorrect(checkCorrect({ value, word }));
			inputRef.current.blur();
		}

		if (id === 'prev') {
			console.log('---', id, '---');
		}
	}

	const handleInputEnter = (evt) => {
		const { value } = evt.target;

		if (evt.key === 'Enter') {
			if (isAudioAuto) {
				audioRef.current.play();
				setIsAudioPlay(true);
			}
			setValue('');
			setIsWordInput(true);
			setIsCorrect(checkCorrect({ value, word }));
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

	const handleDeleteBtnClick = () => {
		console.log('---- delete button ----');
	}

	const handleHardBtnClick = () => {
		console.log('---- hard button ----');
	}

	const handleAudioPlayBtnClick = () => {
		audioRef.current.play();
		setIsAudioPlay(true);
	}

	return (
		<div className='card-unit'>
			<div className='card__container'>
				<NavigateBtn classes='prev' id='prev' onClick={handleNavigateClick}/>
				<ContainerWithShadow>
					<CardContent
						helpSettings={helpSettings}
						settings={settings}
						word={wordJSON}
						onInputEnter={handleInputEnter}
						onInputFocus={handleInputFocus}
						onInputChange={handleInputChange}
						onShowBtnClick={handleShowBtnClick}
						onDeleteBtnClick={handleDeleteBtnClick}
						onHardBtnClick={handleHardBtnClick}
						onAudioPlayBtnClick={handleAudioPlayBtnClick}
						inputRef={inputRef}
						value={value}
						isAudioPlayBtn={true}
						isWordInput={isWordInput}
						isCorrect={isCorrect}
					/>
				</ContainerWithShadow>
				<NavigateBtn classes='next' id='next' onClick={handleNavigateClick}/>
				<audio ref={audioRef} src={audio} preload='auto' onEnded={onAudioEnded} />
			</div>
		</div>
	);
}

export default WordCard;

WordCard.propTypes = {
	// word: PropTypes.object.isRequired,
	// helpSettings: PropTypes.object.isRequired,
	// settings: PropTypes.object.isRequired,
};
