/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import RadioButtonContainer from '../radioButton/radioButtonContainer/RadioButtonContainer';
import HelpImage from '../helpImage/HelpImage';
import HelpText from '../helpText/HelpText';
import WordInput from '../wordInput/WordInput';
import Button from '../button/Button';
import AudioComponent from '../audioComponent/AudioComponent';
import RepeatIcon from '../icons/RepeatIcon';
import DeleteIcon from '../icons/DeleteIcon';
import RestoreIcon from '../icons/RestoreIcon';
import KettlebellIcon from '../icons/KettlebellIcon';
import ShowAnswerIcon from '../icons/ShowAnswerIcon';

const CardContent = (props) => {
  const {
    helpSettings: { isImageShow },
    settings: {
      isShowAnswerBtn, isDeleteBtn, isComplexityBtn,
    },
    isPrevWord,
    isEducation,
    wordDifficulty,
    isCorrect,
    isShowBtnClick,
    isAgainBtnClick,
    onCardBtnClick,
    onWordComplexityBtnClick,
  } = props;

  const [isDeleted, setDeleted] = useState(false);

  const ShowAnswerBtn = (
    <Button
      id="showWord"
      label="Answer"
      dataTitle="Show the answer"
      dataPlacement="top"
      isDisabled={isCorrect || isShowBtnClick || isEducation}
      clickHandler={(id) => onCardBtnClick(id)}
      icon={<ShowAnswerIcon iconTitle="show answer icon" />}
    />
  );

  const DeleteBtn = (
    <Button
      id="deleteWord"
      label="Delete"
      dataTitle="Delete the word from training"
      dataPlacement="top"
      icon={<DeleteIcon iconTitle="delete icon" />}
      clickHandler={(id) => { onCardBtnClick(id, true); setDeleted(true); }}
    />
  );

  const UndoDeleteBtn = (
    <Button
      id="undoDeleteWord"
      label="Restore"
      dataTitle="Undo delete word from training"
      dataPlacement="top"
      icon={<RestoreIcon iconTitle="restore icon" />}
      clickHandler={(id) => { onCardBtnClick(id, false); setDeleted(false); }}
    />
  );

  const AgainBtn = (
    <Button
      isDisabled={isAgainBtnClick}
      id="againWord"
      dataTitle="Repeat the word in this training"
      dataPlacement="top"
      clickHandler={(id) => onCardBtnClick(id)}
      icon={<RepeatIcon iconTitle="repeat icon" />}
    />
  );

  const radioButtons = [
    { label: 'hard', id: 'hard', icon: <KettlebellIcon iconTitle="kettlebell icon" /> },
    { label: 'normal', id: 'normal', icon: <KettlebellIcon iconTitle="kettlebell icon" /> },
    { label: 'easy', id: 'easy', icon: <KettlebellIcon iconTitle="kettlebell icon" /> },
  ];

  const isAvailableComplexityButtons = isComplexityBtn
    && !isPrevWord
    && (isCorrect || isEducation);
  const complexityButtons = (
    <div className="card-controls__buttons">
      {AgainBtn}
      <RadioButtonContainer
        items={radioButtons}
        onChange={onWordComplexityBtnClick}
        checkedItem={wordDifficulty}
        dataTitle="Select the word difficulty category"
        dataPlacement="top"
      />
    </div>
  );

  return (
    <div className="card-content">
      <div className="help-content">
        {isImageShow && <HelpImage {...props} />}
        <HelpText {...props} />
      </div>
      <div className="card-controls">
        {isAvailableComplexityButtons && complexityButtons}
        <div className="card-controls__buttons">
          {isDeleteBtn && !isPrevWord && !isDeleted && DeleteBtn}
          {isDeleteBtn && !isPrevWord && isDeleted && UndoDeleteBtn}
          {isShowAnswerBtn && !isPrevWord && ShowAnswerBtn}
          <AudioComponent {...props} />
        </div>
      </div>
      <div className="learn-content">
        <WordInput {...props} />
      </div>
    </div>
  );
};

CardContent.defaultProps = {
  wordDifficulty: 'normal',
};

export default CardContent;

CardContent.propTypes = {
  settings: PropTypes.shape({
    isShowAnswerBtn: PropTypes.bool.isRequired,
    isDeleteBtn: PropTypes.bool.isRequired,
    isComplexityBtn: PropTypes.bool.isRequired,
  }).isRequired,
  helpSettings: PropTypes.shape({
    isImageShow: PropTypes.bool.isRequired,
  }).isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isEducation: PropTypes.bool.isRequired,
  isPrevWord: PropTypes.bool.isRequired,
  isShowBtnClick: PropTypes.bool.isRequired,
  isAgainBtnClick: PropTypes.bool.isRequired,
  onCardBtnClick: PropTypes.func.isRequired,
  onWordComplexityBtnClick: PropTypes.func.isRequired,
  wordDifficulty: PropTypes.string,
};
