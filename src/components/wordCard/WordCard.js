import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';

const checkCorrect = ({ value, word }) => value.toLowerCase() === word.toLowerCase();

const WordCard = ({
	helpSettings,
	settings,
	words,
	onErrorAnswer,
	onHardBtnClick,
	onComplexityBtnClick,
	onDeleteBtnClick,
	onNextBtnClick,
}) => {
	const [isWordInput, setIsWordInput] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isShowBtnClick, setIsShowBtnClick] = useState(false);
	const [value, setValue] = useState('');
	const [isPrevWord, setIsPrevWord] = useState(false);

	const { isTextExampleShow, isTextMeaningShow } = helpSettings;
	const { isAudioAuto, isComplexityBtn } = settings;

	const inputRef = useRef();
	const audioRef = useRef();

	// const wordAnswer = {
	// 	errors: 0,
	// 	complexity: null,
	// 	status: null,
	// }

	const currentWord = isPrevWord
		? words[0]
		: words[words.length - 1];
	const { word, audio, audioExample, audioMeaning } = currentWord;

	let currentTruck = 0;
	const tracks = [audio];
	if (isTextExampleShow) {
		tracks.push(audioExample);
	}
	if (isTextMeaningShow) {
		tracks.push(audioMeaning);
	}

	const handleAnswer = (isCorrectAnswer) => {
		if (isAudioAuto) {
			audioPlay();
		}
		setValue('');
		setIsWordInput(true);
		inputRef.current.blur();

		isCorrectAnswer
			? setIsCorrect(true)
			: onErrorAnswer();
	}

	const getNextWord = () => {
		console.log('----- get next word ----');

		setIsWordInput(false);
		setIsCorrect(false);
		setIsShowBtnClick(false);
		setValue('');

		onNextBtnClick();
	}

	const audioPlay = () => {
		audioRef.current.pause(); //error
		currentTruck = 0;
		audioRef.current.src = tracks[currentTruck];
		audioRef.current.play();
	}

	const onAudioEnded = () => {
		if (currentTruck < tracks.length - 1) {
			currentTruck += 1;
			audioRef.current.src = tracks[currentTruck];
			audioRef.current.play();
			return;
		}

		if ((isCorrect || isShowBtnClick) && !isComplexityBtn) {
			getNextWord();
		}
	}

	const handleInputChange = (evt) => {
		setValue(evt.target.value);
	}

	const handleNavigateClick = ({ id }) => {
		if (id === 'next') {
			if (isPrevWord) {
				setIsPrevWord(false);
				return;
			}

			if (isCorrect || isShowBtnClick) {
				getNextWord();
				return;
			}

			handleAnswer(checkCorrect({ value, word }));
		}

		if (id === 'prev') {
			setIsWordInput(false);
			setIsPrevWord(true);
		}
	}

	const handleInputEnter = (evt) => {
		if (evt.key === 'Enter') {
			const { value } = evt.target;
			handleAnswer(checkCorrect({ value, word }));
		}
	}

	const handleInputFocus = () => {
		if (isWordInput) {
			setIsWordInput(false);
			audioRef.current.pause();
		}
	}

	const handleShowBtnClick = () => {
		setIsShowBtnClick(true);
		setIsCorrect(true);
		handleAnswer(false);
	}

	const handleAudioPlayBtnClick = () => {
		audioPlay();
	}

	const handleWordComplexityBtnClick = (id) => {
		onComplexityBtnClick(id);
	}

	const handleCardBtnClick = (id) => {
		const handlers = {
			deleteWord: onDeleteBtnClick,
			hardWord: onHardBtnClick,
			speakWord: handleAudioPlayBtnClick,
			showWord: handleShowBtnClick,
		}

		handlers[id]();
	}

	const cardContentProps = {
		helpSettings: helpSettings,
		settings: settings,
		word: currentWord,
		onInputEnter: handleInputEnter,
		onInputFocus: handleInputFocus,
		onInputChange: handleInputChange,
		onCardBtnClick: handleCardBtnClick,
		onWordComplexityBtnClick: handleWordComplexityBtnClick,
		inputRef: inputRef,
		value: value,
		isShowBtnClick: isShowBtnClick,
		isWordInput: isWordInput,
		isCorrect: isCorrect,
		isPrevWord: isPrevWord,
	};

	return (
		<div className='card-unit'>
			<div className='card__container'>
				{<NavigateBtn
					classes='prev'
					id='prev'
					onClick={handleNavigateClick}
					isInvisible={(words.length === 1) || isPrevWord}
					isDisabled={isCorrect || isShowBtnClick}
				/>}
				<ContainerWithShadow padding='20px'>
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
	words: PropTypes.array.isRequired,
	settings: PropTypes.shape({
		isAudioAuto: PropTypes.bool.isRequired,
	}),
	helpSettings: PropTypes.shape({
		isTextExampleShow: PropTypes.bool.isRequired,
		isTextMeaningShow: PropTypes.bool.isRequired,
	}),
	onErrorAnswer: PropTypes.func.isRequired,
	onNextBtnClick: PropTypes.func.isRequired,
};
