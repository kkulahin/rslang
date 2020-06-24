import React from 'react';
import PropTypes from 'prop-types';

import RadioButtonContainer from '../radioButton/radioButtonContainer/RadioButtonContainer';

import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../button/Button';

const CardContent = (props) => {
	const {
		settings: { isShowAnswerBtn, isDeleteBtn, isHardBtn },
		helpSettings, isPrevWord, word, isWordInput, isCorrect,
		onCardBtnClick, onWordComplexityBtnClick,
	} = props;

	const ShowAnswerBtn = (
		<Button
			id='showWord'
			label='Answer'
			isDisabled={isWordInput || isPrevWord}
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const DeleteBtn = (
		<Button
			id='deleteWord'
			label='Delete'
			isDisabled={isWordInput || isPrevWord}
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const HardBtn = (
		<Button
			isActive={true}
			id='hardWord'
			label='Hard'
			isDisabled={isCorrect || isPrevWord}
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const AudioPlayBtn = (
		<Button
			id='speakWord'
			label='Speak'
			isDisabled={!isPrevWord}
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const radioButtons = [
		{ label: 'XL', id: 'снова' },
		{ label: 'L', id: 'трудно' },
		{ label: 'S', id: 'хорошо' },
		{ label: 'M', id: 'легко' },
	];

		return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpImage
					helpSettings={helpSettings}
					word={word}
				/>
				<HelpText
					helpSettings={helpSettings}
					word={word}
					isWordInput={isWordInput || isPrevWord}
				/>
			</div>
			<div className='card-controls'>
				<RadioButtonContainer
					items={radioButtons}
					onChange={onWordComplexityBtnClick}
					checkedItem='снова'
					isDisabled={isWordInput || isPrevWord}
				/>
				{isHardBtn && HardBtn}
				{isDeleteBtn && DeleteBtn}
				{isShowAnswerBtn && ShowAnswerBtn}
				{AudioPlayBtn}
			</div>
			<div className='learn-content'>
				<WordInput {...props} />
			</div>
		</div>
	);
}

export default CardContent;

CardContent.propTypes = {
	isWordInput: PropTypes.bool.isRequired,
	isCorrect: PropTypes.bool.isRequired,
	isPrevWord: PropTypes.bool.isRequired,
	onCardBtnClick: PropTypes.func.isRequired,
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	settings: PropTypes.shape({
		isShowAnswerBtn: PropTypes.bool.isRequired,
		isDeleteBtn: PropTypes.bool.isRequired,
		isHardBtn: PropTypes.bool.isRequired,
	}),
};
