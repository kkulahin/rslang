import React from 'react';
// import PropTypes from 'prop-types';

import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../../button/Button';

const CardContent = ({
	helpSettings, word, onInputEnter, onInputFocus, onInputChange, inputRef, isWordInput, onShowBtnClick, value, isCorrect,
}) => {
	return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpImage helpSettings={helpSettings} word={word} />
				<HelpText helpSettings={helpSettings} word={word} isWordInput={isWordInput} />
			</div>
			<div className='learn-content'>
				<WordInput
					word={word}
					onInputEnter={onInputEnter}
					onInputFocus={onInputFocus}
					onInputChange={onInputChange}
					isWordInput={isWordInput}
					value={value}
					isCorrect={isCorrect}
					inputRef={inputRef}
				/>
				<Button
					name='check'
					label='Show the answer'
					clickHandler={() => onShowBtnClick()}
				/>
			</div>
		</div>
	);
}

CardContent.defaultProps = {
	// children: null,
};

export default CardContent;

CardContent.propTypes = {
	// props: PropTypes.any,
};
