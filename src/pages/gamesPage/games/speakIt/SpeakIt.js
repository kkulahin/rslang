import React, { useState, useEffect } from 'react';
import {
  Header, Icon, Image, Button,
} from 'semantic-ui-react';

import { ProgressBar, Step } from 'react-step-progress-bar';
import TestImage from '../../../../assets/image/speakIt.png';
import { getWords } from '../../../../controllers/words/words';

import './speakIt.scss';
import 'react-step-progress-bar/styles.css';

const gitDataUrl = 'https://raw.githubusercontent.com/kaxaru/rslang-data/master/';

const stepPic = [
  'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851',
  'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
];

const defaultParams = {
  StepCounter: 6,
  Words: 10,
};

const defGameOption = {
  curStage: 0,
  maxStage: defaultParams.StepCounter - 1,
  stagesOption: [],
};

const SpeackIt = () => {
  const [gameOption, setGameOption] = useState(defGameOption);
  const [activeWord, setActiveWord] = useState(null);
  const [activeWordParams, setActiveWordParams] = useState(null);

  const getWordsForStage = () => {
    const getWordsPromises = [];
    for (let stage = 0; stage <= defGameOption.maxStage; stage += 1) {
      getWordsPromises.push(getWords(gameOption.curStage, stage, true));
    }
    let newGameOption = {};
    Promise.all(getWordsPromises).then((resps) => {
      resps.forEach((resp, index) => {
        const words = resp.data;
        const stagesOption = {};
        stagesOption[`stage${index}`] = words;
        newGameOption.stagesOption = newGameOption.stagesOption || gameOption.stagesOption;
        newGameOption = {
          ...gameOption,
          stagesOption: [...newGameOption.stagesOption, stagesOption],
        };
      });
      setGameOption(newGameOption);
    });
  };

  useEffect(() => {
    if (Array.isArray(gameOption.stagesOption) && !gameOption.stagesOption.length) {
      getWordsForStage();
    }
  });

  useEffect(() => {
    const activeEl = document.querySelector(`.speakIt [data-value=${activeWord}]`);
    if (activeEl !== null) {
      const wordParams = {
        value: activeEl.getAttribute('data-value'),
        translate: activeEl.getAttribute('data-translate'),
        image: activeEl.getAttribute('data-image'),
        audio: activeEl.getAttribute('data-audio'),
      };
      setActiveWordParams(wordParams);
    }
  }, [activeWord]);

  const restart = () => {
    setGameOption(defGameOption);
  };

  const buildProgressStep = () => {
    const stepSize = Array.from({ length: defaultParams.StepCounter }, (v, k) => k);
    const stepEls = stepSize.map((s, index) => (
      <Step transition="scale" key={s} onClicl={() => console.log(`click ${index}`)}>
        {({ accomplished }) => (
          <img
            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
            width="30"
            src={stepPic[index]}
            alt=""
          />
        )}
      </Step>
    ));
    return (
      <ProgressBar
        percent={(gameOption.curStage * 100) / gameOption.maxStage}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      >
        {stepEls}
      </ProgressBar>
    );
  };

  const onClickWord = (e) => {
    const word = e.currentTarget.querySelector('.item-content');
    setActiveWord(word.getAttribute('data-value'));
  };

  const buildWordEl = () => {
    const wordSize = Array.from({ length: defaultParams.Words }, (v, k) => k);
    let words = null;
    if (Array.isArray(gameOption.stagesOption) && gameOption.stagesOption.length) {
      const curStageWords = gameOption.stagesOption[gameOption.curStage];
      words = curStageWords[`stage${[gameOption.curStage]}`];
      console.log(words);
    }
    const wordEl = wordSize.map((w) => (
      <div className="item" key={w} onClick={onClickWord}>
        <div className="item-icon">
          <Icon name="assistive listening systems" />
        </div>
        <div
          className="item-content"
          data-value={words !== null ? words[w].word : null}
          data-translate={words !== null ? words[w].wordTranslate : null}
          data-image={words !== null ? words[w].image : null}
          data-audio={words !== null ? words[w].audio : null}
        >
          <p>{words !== null ? words[w].word : null}</p>
          <p>{words !== null ? words[w].transcription : null}</p>
        </div>
      </div>
    ));
    return <>{wordEl}</>;
  };

  const getImage = () => {
    if (activeWordParams === null) return TestImage;
    return `${gitDataUrl}${activeWordParams.image}`;
  };

  return (
    <div className="speakIt">
      <div className="speakIt-header">
        <Header as="h2" className="games-header">
          <Icon name="game" />
          <Header.Content>SpeakIt</Header.Content>
        </Header>
      </div>
      <div className="app-speakIt" />
      <div className="speakIt-progressbar">
        {buildProgressStep()}
      </div>
      <div className="speakIt-image__wrapper">
        <Image src={getImage()} size="medium" bordered alt="" />
        <p>{activeWordParams?.translate}</p>
      </div>
      <div className="speakIt-items">
        {buildWordEl()}
      </div>
      <div className="speakIt-panel">
        <Button primary onClick={restart}>Restart</Button>
        <Button primary>Speak</Button>
        <Button primary>Results</Button>

      </div>
    </div>
  );
};

export default SpeackIt;
