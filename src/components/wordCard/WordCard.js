import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import NavigateBtn from './navigateBtn/NavigateBtn';
import CardContent from './cardContent/CardContent';

import './WordCard.scss';

const checkCorrect = ({ value, word }) => {
	return value.toLowerCase() === word.toLowerCase();
}

const WordCard = ({
	helpSettings,
	settings,
	words,
	onErrorAnswer,
	onNextBtnClick,
	onHardBtnClick,
	onDeleteBtnClick,
}) => {
	const [isWordInput, setIsWordInput] = useState(false);
	const [isCorrect, setIsCorrect] = useState(null);
	const [value, setValue] = useState('');
	const [isPrevWord, setIsPrevWord] = useState(false);

	const { isTextExampleShow, isTextMeaningShow } = helpSettings;
	const { isAudioAuto } = settings;

	const inputRef = useRef();
	const audioRef = useRef();

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
		setIsWordInput(false);
		setIsCorrect(null);
		setValue('');

		onNextBtnClick();
	}

	const audioPlay = () => {
		audioRef.current.pause();
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

		if (isCorrect) {
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

			if (isCorrect) {
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
		handleAnswer(false);
	}

	const handleAudioPlayBtnClick = () => {
		audioPlay();
	}

	const cardContentProps = {
		helpSettings: helpSettings,
		settings: settings,
		word: currentWord,
		onInputEnter: handleInputEnter,
		onInputFocus: handleInputFocus,
		onInputChange: handleInputChange,
		onShowBtnClick: handleShowBtnClick,
		onDeleteBtnClick: onDeleteBtnClick,
		onHardBtnClick: onHardBtnClick,
		onAudioPlayBtnClick: handleAudioPlayBtnClick,
		inputRef: inputRef,
		value: value,
		isWordInput: isWordInput,
		isCorrect: isCorrect,
		isPrevWord: isPrevWord,
	};

	const isPrevBtnInvisible = (words.length === 1) || isPrevWord;
	return (
		<div className='card-unit'>
			<div className='card__container'>
				{<NavigateBtn
					classes='prev'
					id='prev'
					onClick={handleNavigateClick}
					isInvisible={isPrevBtnInvisible}
					isDisabled={isCorrect}
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
	onHardBtnClick: PropTypes.func.isRequired,
	onDeleteBtnClick: PropTypes.func.isRequired,
};
