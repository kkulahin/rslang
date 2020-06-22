import React from 'react';
import PropTypes from 'prop-types';

import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../../button/Button';

const CardContent = (props) => {
	const {
		settings: { isShowAnswerBtn, isDeleteBtn, isHardBtn },
		helpSettings, isPrevWord, word, isWordInput, onShowBtnClick, onDeleteBtnClick, onHardBtnClick, isAudioPlayBtn, onAudioPlayBtnClick
	} = props;

	const ShowAnswerBtn = (
		<Button
			name='check'
			label='Show the answer'
			clickHandler={() => onShowBtnClick()}
		/>
	);

	const DeleteBtn = (
		<Button
			name='check'
			label='Delete'
			clickHandler={() => onDeleteBtnClick()}
		/>
	);

	const HardBtn = (
		<Button
			name='check'
			label='Hard'
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

	return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpImage helpSettings={helpSettings} word={word} />
				<HelpText helpSettings={helpSettings} word={word} isWordInput={isWordInput || isPrevWord} />
			</div>
			<div className='card-controls'>
				{isHardBtn && HardBtn}
				{isDeleteBtn && DeleteBtn}
				{isShowAnswerBtn && !isPrevWord && ShowAnswerBtn}
				{isAudioPlayBtn && isPrevWord && AudioPlayBtn}
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
	isPrevWord: PropTypes.bool.isRequired,
	onShowBtnClick: PropTypes.func.isRequired,
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	settings: PropTypes.shape({
		isShowAnswerBtn: PropTypes.bool.isRequired,
	}),
};
