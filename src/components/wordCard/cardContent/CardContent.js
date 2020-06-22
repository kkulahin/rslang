import React from 'react';
import PropTypes from 'prop-types';

import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../../button/Button';

const CardContent = (props) => {
	const {
		settings: { isShowAnswerBtn },
		helpSettings, word, isWordInput, onShowBtnClick,
	} = props;

	const ShowAnswerBtn = (
		<Button
			name='check'
			label='Show the answer'
			clickHandler={() => onShowBtnClick()}
		/>
	);

	return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpImage helpSettings={helpSettings} word={word} />
				<HelpText helpSettings={helpSettings} word={word} isWordInput={isWordInput} />
			</div>
			<div className='learn-content'>
				<WordInput {...props} />
				{isShowAnswerBtn && ShowAnswerBtn}
			</div>
		</div>
	);
}

export default CardContent;

CardContent.propTypes = {
	isWordInput: PropTypes.bool.isRequired,
	onShowBtnClick: PropTypes.func.isRequired,
	helpSettings: PropTypes.object.isRequired,
	word: PropTypes.object.isRequired,
	settings: PropTypes.shape({
		isShowAnswerBtn: PropTypes.bool.isRequired,
	}),
};
