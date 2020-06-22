import React, { useState, useRef } from 'react';
// import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';

// const helpSettings = {
// 	isImageShow: true,
// 	isTranscriptionShow: true,
// 	isWordTranslateShow: true,
// 	isTextExampleShow: true,
// 	isTextMeaningShow: true,
// 	isTranslateShow: true,
// };

// const settings = {
// 	isShowAnswerBtn: true,
// 	isDeleteBtn: true,
// 	isHardBtn: true,
// 	isAudioAuto: true,
// };

// const wordJSON = {
// 	"word": "agree",
// 	"image": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg",
// 	"audio": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.mp3",
// 	"audioMeaning": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_meaning.mp3",
// 	"audioExample": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_example.mp3",
// 	"textMeaning": "To <i>agree</i> is to have the same opinion or belief as another person",
// 	"textExample": "The students <b>agree</b> they have too much homework",
// 	"transcription": "[əgríː]",
// 	"wordTranslate": "согласна",
// 	"textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
// 	"textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
// 	"id": 1,
// };

const checkCorrect = ({ value, word }) => {
	return value.toLowerCase() === word.toLowerCase();
}

const WordCard = ({
	helpSettings,
	settings,
	wordJSON,
	onErrorAnswer,
	onPrevBtnClick,
	onNextBtnClick,
	onHardBtnClick,
	onDeleteBtnClick,
	isFirstWord,
	isPrevWord,
}) => {

	const { word, audio, audioExample, audioMeaning } = wordJSON;
	const { isTextExampleShow, isTextMeaningShow } = helpSettings;
	const { isAudioAuto } = settings;

	const [isWordInput, setIsWordInput] = useState(false);
	const [isCorrect, setIsCorrect] = useState(null);
	const [value, setValue] = useState('');
	const [isAudioPlay, setIsAudioPlay] = useState(false);

	const inputRef = useRef();
	const audioRef = useRef();

	let currentTruck = 0;
	const tracks = [audio];
	if (isTextExampleShow) {
		tracks.push(audioExample);
	}
	if (isTextMeaningShow) {
		tracks.push(audioMeaning);
	}

	const audioPlay = () => {
		currentTruck = 0;
		audioRef.current.src = tracks[currentTruck];
		audioRef.current.play();
		setIsAudioPlay(true);
	}

	const onAudioEnded = () => {
		if (currentTruck < tracks.length - 1) {
			currentTruck += 1;
			audioRef.current.src = tracks[currentTruck];
			audioRef.current.play();
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

			onNextBtnClick();
		}

		if (id === 'prev') {
			setIsWordInput(false);
			onPrevBtnClick();
		}
	}

	const handleInputEnter = (evt) => {
		const { value } = evt.target;

		if (evt.key === 'Enter') {
			if (isAudioAuto) {
				audioPlay();
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
			audioRef.current.pause();
		}
	}

	const handleShowBtnClick = () => {
		setValue('');
		setIsWordInput(true);
		onErrorAnswer();
	}

	const handleAudioPlayBtnClick = () => {
		audioPlay();
	}

	const cardContentProps = {
		helpSettings: helpSettings,
		settings: settings,
		word: wordJSON,
		onInputEnter: handleInputEnter,
		onInputFocus: handleInputFocus,
		onInputChange: handleInputChange,
		onShowBtnClick: handleShowBtnClick,
		onDeleteBtnClick: onDeleteBtnClick,
		onHardBtnClick: onHardBtnClick,
		onAudioPlayBtnClick: handleAudioPlayBtnClick,
		inputRef: inputRef,
		value: value,
		isAudioPlayBtn: true,
		isWordInput: isWordInput,
		isCorrect: isCorrect,
		isPrevWord: isPrevWord,
	};

	return (
		<div className='card-unit'>
			<div className='card__container'>
				{<NavigateBtn classes='prev' id='prev' onClick={handleNavigateClick} isInvisible={isFirstWord || isPrevWord}/>}
				<ContainerWithShadow>
					<CardContent
						{...cardContentProps}
					/>
				</ContainerWithShadow>
				<NavigateBtn classes='next' id='next' onClick={handleNavigateClick}/>
				<audio ref={audioRef} src={tracks[0]} preload='auto' onEnded={onAudioEnded} />
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
