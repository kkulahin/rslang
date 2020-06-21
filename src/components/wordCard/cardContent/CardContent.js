import React from 'react';
// import PropTypes from 'prop-types';

import HelpImage from '../helpImage/HelpImage';
import HelpTranscription from '../helpTranscription/HelpTranscription';
import HelpWordTranslate from '../helpWordTranslate/HelpWordTranslate';
import HelpTextMeaning from '../helpTextMeaning/HelpTextMeaning';
import HelpTextExample from '../helpTextExample/HelpTextExample';
import WordInput from '../wordInput/WordInput';
import Button from '../../button/Button';

const CardContent = ({ helpSettings, word }) => {

	return (
		<div className='card-content'>
			<div className='help-content'>
				<HelpImage helpSettings={helpSettings} word={word} />
				<ul className='help-content__text'>
					<HelpTranscription helpSettings={helpSettings} word={word} />
					<HelpWordTranslate helpSettings={helpSettings} word={word} />
					<HelpTextMeaning helpSettings={helpSettings} word={word} />
					<HelpTextExample helpSettings={helpSettings} word={word} />
				</ul>
			</div>
			<div className='learn-content'>
				<WordInput word={word}/>
				<Button name='check' label='Show the answer' />
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
