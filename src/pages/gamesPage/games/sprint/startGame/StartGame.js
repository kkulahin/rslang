import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '../../../../../components/button/Button';
import RadioButton from '../../../../../components/radioButton/radioButtonContainer/RadioButtonContainer';

import responseFromServer from '../../../../../utils/responseFromServer';
import getRandomInt from '../../../../../utils/random';
import { SchoolURL } from '../../../../../config/default';

import './StartGame.scss';

const StartGame = ({ startGame }) => {
  const [startBtnDisabled, setStartBtnDisabled] = useState(true);

  const [gameLevel, setGamelevel] = useState(null);

  useEffect(() => {
    if (gameLevel) {
      setStartBtnDisabled(false);
    }
  }, [gameLevel]);

  function prepareGame() {
    const pages = [
      getRandomInt(0, 10, true),
      getRandomInt(11, 20, true),
      getRandomInt(21, 30, true),
    ];
    const group = gameLevel - 1;

    const wordsArr = pages.map((page) => responseFromServer(`${SchoolURL}/words?page=${page}&group=${group}`)
      .then((response) => response.data.map((wordInfo) => ({
        word: wordInfo.word,
        translate: wordInfo.wordTranslate,
      }))));

    return Promise
      .all(wordsArr)
      .then((setWords) => setWords.reduce((arr, set) => arr.concat(set)));
  }

  return (
    <div className="game-start-window">
      <p className="game-start-window__title">Choose game level:</p>
      <RadioButton
        items={['1 level', '2 level', '3 level', '4 level', '5 level', '6 level']}
        onChange={({ target }) => {
          const selectedLevel = target.id.slice(0, 1);

          if (selectedLevel !== gameLevel) {
            setGamelevel(selectedLevel);
          } else {
            setStartBtnDisabled(!startBtnDisabled);
          }
        }}
      />
      <div className="button-wrapper">
        <Button
          name="press"
          label="START"
          id="start-btn"
          isDisabled={startBtnDisabled}
          clickHandler={() => {
            prepareGame().then((data) => startGame(data));
            setStartBtnDisabled(true);
          }}
        />
      </div>
    </div>
  );
};

StartGame.propTypes = {
  startGame: PropTypes.func.isRequired,
};

export default StartGame;
