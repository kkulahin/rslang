import React from 'react';
import PropTypes from 'prop-types';

import RadioButtonContainer from '../radioButton/radioButtonContainer/RadioButtonContainer';

import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../button/Button';
import Word from '../../../utils/spacedRepetition/Word';

const CardContent = (props) => {
	const {
		settings: { isShowAnswerBtn, isDeleteBtn, isHardBtn, isComplexityBtn },
		helpSettings, isPrevWord, word, isWordInput, isCorrect, isShowBtnClick,
		onCardBtnClick, onWordComplexityBtnClick,
	} = props;
	const complexity = word.getDifficulty();
	const isHard = false;

	const ShowAnswerBtn = (
		<Button
			id='showWord'
			label='Answer'
			isDisabled={isCorrect || isShowBtnClick}
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const DeleteBtn = (
		<Button
			id='deleteWord'
			label='Delete'
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const HardBtn = (
		<Button
			isActive={isHard}
			id='hardWord'
			label='Hard'
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const AudioPlayBtnEnabled = isPrevWord || ((isCorrect || isShowBtnClick) && isComplexityBtn);
	const AudioPlayBtn = (
		<Button
			id='speakWord'
			label='Speak'
			isDisabled={!AudioPlayBtnEnabled}
			clickHandler={(id) => onCardBtnClick(id)}
		/>
	);

	const radioButtons = [
		{ label: 'again', id: 'снова' },
		{ label: 'diff', id: 'трудно' },
		{ label: 'good', id: 'хорошо' },
		{ label: 'easy', id: 'легко' },
	];

	const complexityBtn = (
		<RadioButtonContainer
			items={radioButtons}
			onChange={onWordComplexityBtnClick}
			checkedItem={complexity}
			isAttention={isCorrect || isShowBtnClick}
		/>
	);

		return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpImage
					helpSettings={helpSettings}
					word={word.definition}
				/>
				<HelpText
					helpSettings={helpSettings}
					word={word.definition}
					isFullState={isWordInput || isPrevWord}
				/>
			</div>
			<div className='card-controls'>
				{isComplexityBtn && !isPrevWord && complexityBtn}
				<div className='card-controls__buttons'>
					{isHardBtn && !isPrevWord && HardBtn}
					{isDeleteBtn && !isPrevWord && DeleteBtn}
					{isShowAnswerBtn && !isPrevWord && ShowAnswerBtn}
					{AudioPlayBtn}
				</div>
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
	word: PropTypes.instanceOf(Word).isRequired,
	settings: PropTypes.shape({
		isShowAnswerBtn: PropTypes.bool.isRequired,
		isDeleteBtn: PropTypes.bool.isRequired,
		isHardBtn: PropTypes.bool.isRequired,
	}),
};
