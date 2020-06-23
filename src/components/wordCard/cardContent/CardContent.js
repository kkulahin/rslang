import React from 'react';
import PropTypes from 'prop-types';

import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../../button/Button';

const CardContent = (props) => {
	const {
		settings: { isShowAnswerBtn, isDeleteBtn, isHardBtn },
		helpSettings, isPrevWord, word, isWordInput, onShowBtnClick,
		onDeleteBtnClick, onHardBtnClick, onAudioPlayBtnClick,
	} = props;

	const ShowAnswerBtn = (
		<Button
			name='check'
			label='Show the answer'
			isDisabled={isWordInput || isPrevWord}
			clickHandler={() => onShowBtnClick()}
		/>
	);

	const DeleteBtn = (
		<Button
			name='check'
			label='Delete'
			isDisabled={isWordInput || isPrevWord}
			clickHandler={() => onDeleteBtnClick()}
		/>
	);

	const HardBtn = (
		<Button
			name='check'
			label='Hard'
			isDisabled={isWordInput || isPrevWord}
			clickHandler={() => onHardBtnClick()}
		/>
	);

	const AudioPlayBtn = (
		<Button
			name='check'
			label='AudioPlay'
			clickHandler={() => onAudioPlayBtnClick()}
		/>
	);

	const learnContentClasses = isPrevWord
		? 'learn-content learn-content--prev'
		: 'learn-content';

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
				{isHardBtn && HardBtn}
				{isDeleteBtn && DeleteBtn}
				{isShowAnswerBtn && ShowAnswerBtn}
			</div>
			<div className={learnContentClasses}>
				<WordInput {...props} />
				{isPrevWord && AudioPlayBtn}
			</div>
		</div>
	);
}

export default CardContent;

CardContent.propTypes = {
	isWordInput: PropTypes.bool.isRequired,
	isPrevWord: PropTypes.bool.isRequired,
	onShowBtnClick: PropTypes.func.isRequired,
	onDeleteBtnClick: PropTypes.func.isRequired,
	onHardBtnClick: PropTypes.func.isRequired,
	onAudioPlayBtnClick: PropTypes.func.isRequired,
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	settings: PropTypes.shape({
		isShowAnswerBtn: PropTypes.bool.isRequired,
		isDeleteBtn: PropTypes.bool.isRequired,
		isHardBtn: PropTypes.bool.isRequired,
	}),
};
