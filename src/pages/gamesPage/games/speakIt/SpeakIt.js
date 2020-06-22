import React, { useState, useEffect, useRef } from 'react';
import {
  Header, Icon, Image, Button, Input,
} from 'semantic-ui-react';

import { ProgressBar, Step } from 'react-step-progress-bar';
import TestImage from '../../../../assets/image/speakIt.png';
import { getWords } from '../../../../controllers/words/words';
import Dictaphone from '../../../../components/dictaphone/Dictaphone';

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

const isEmpty = (obj) => Object.keys(obj).length === 0;

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
  const [gameMode, setGameMode] = useState(false);
  const [userRecWord, setUserRecWord] = useState(null);
  const [gameplayWords, setGamePlayWords] = useState({ errors: {}, rights: {} });
  const [gameResult, setGameResult] = useState(false);
  const input = useRef(null);

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

  useEffect(() => {
    if (activeWordParams !== null && !gameMode) {
      const audio = document.querySelector('.speakIt-audio');
      audio.play();
    }
  }, [activeWordParams, gameMode]);

  useEffect(() => {
    if (gameMode) {
      const newGamePlayWords = {
        errors: gameOption.stagesOption,
        rights: {},
      };
      setGamePlayWords(newGamePlayWords);
    } else {
      setGamePlayWords({ errors: {}, rights: {} });
    }
  }, [gameMode, gameOption.stagesOption]);

  const restart = () => {
    if (gameResult) {
      setGameResult(false);
    }
    setGameOption(defGameOption);
    setGameMode(false);
  };

  const start = () => {
    setGameMode(true);
  };

  const onClickTest = (e) => {
    if (e.target.nodeName === 'IMG') {
      const cStep = e.target.getAttribute('data-step');
      const newGameOption = {
        ...gameOption,
        curStage: cStep,
      };
      setGameOption(newGameOption);
    }
    return false;
  };

  const buildProgressStep = () => {
    const stepSize = Array.from({ length: defaultParams.StepCounter }, (v, k) => k);
    const stepEls = stepSize.map((s, index) => (
      <Step transition="scale" key={s}>
        {({ accomplished }) => (
          <img
            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
            width="30"
            src={stepPic[index]}
            data-step={index}
            alt=""
          />
        )}
      </Step>
    ));
    return (
      <ProgressBar
        percent={(gameOption.curStage * 100) / gameOption.maxStage}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
        onClick={onClickTest}
      >
        {stepEls}
      </ProgressBar>
    );
  };

  const onClickSetWord = (e) => {
    const item = e.currentTarget;
    /* item.classList.add('active'); */
    const word = item.querySelector('.item-content');
    setActiveWord(word.getAttribute('data-value'));
  };

  const isActiveItemClass = (cWord, index) => {
    if (cWord === null) return '';
    if (!gameMode && cWord[index].word === activeWord) {
      return 'active';
    }
    return '';
  };

  const getSpeechQuery = (value) => {
    console.log(value);
    setUserRecWord(value);
  };

  const isImageDescription = () => {
    if (gameMode) {
      return (
        <div className="input-wrapper">
          <input icon="microphone" readOnly ref={input} />
          <Dictaphone getSpeechQuery={getSpeechQuery} setInputValue={input} />
        </div>

      );
    }
    return (
      <p>{activeWordParams?.translate}</p>
    );
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
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div className={`${isActiveItemClass(words, w)} item`} key={w} onClick={onClickSetWord} role="menuitem" tabIndex={w}>
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

  const buildStatisticErrors = (errorEls = true) => {
    console.log('testEr');
    if (!gameMode) return null;
    const { errors, rights } = gameplayWords;
    const { curStage } = gameOption;
    if (isEmpty(errors) && isEmpty(rights)) return null;
    if (errorEls && !isEmpty(errors)) {
      const stage = errors[curStage];
      const words = stage[`stage${curStage}`];
      const wordsErr = words.map((w, index) => (
        <div className="result-item" key={index}>
          <div className="item-icon">
            <Icon name="assistive listening systems" />
          </div>
          <p>{w.word }</p>
          <p>{w.transcription }</p>
        </div>
      ));
      return (
        <>
          <p className="results-errors">
            Errors:
            <span className="errors-num">{words.length}</span>
          </p>
          {wordsErr}

        </>
      );
    }
    if (!errorEls && !isEmpty(rights)) {
      const stage = rights[curStage];
      const words = stage[`stage${curStage}`];
      const wordsErr = words.map((w, index) => (
        <div className="result-item" key={w.word}>
          <div className="item-icon">
            <Icon name="assistive listening systems" />
          </div>
          <p>{w.word }</p>
          <p>{w.transcription }</p>
        </div>
      ));
      return (
        <>
          <p className="results-right">
            Rights:
            <span className="right-num">{words.length}</span>
          </p>
          {wordsErr}

        </>
      );
    }
  };

  const getImage = () => {
    if (activeWordParams === null) return TestImage;
    return `${gitDataUrl}${activeWordParams.image}`;
  };

  const resultPage = () => {
    const mic = document.querySelector('.input-wrapper .icon');
    if (!mic.classList.contains('slash')) {
      mic.click();
    }

    setGameResult(true);
  };

  const backToMain = () => {
    setGameResult(false);
  };

  return (
    <>
      <div className={`speakIt ${gameResult ? 'invisible' : 'visible'}`}>
        <div className="speakIt-header">
          <Header as="h2" className="games-header">
            <Icon name="game" />
            <Header.Content>SpeakIt</Header.Content>
          </Header>
        </div>
        <div className="app-speakIt" />
        <div className="speakIt-progressbar" onClick={onClickTest}>
          {buildProgressStep()}
        </div>
        <div className="speakIt-image__wrapper">
          <Image src={getImage()} size="medium" bordered alt="" />
          {isImageDescription()}
        </div>
        <div className="speakIt-items">
          {buildWordEl()}
        </div>
        <div className="speakIt-panel">
          <Button primary onClick={restart}>Restart</Button>
          <Button primary onClick={start}>Speak</Button>
          {gameMode ? <Button primary onClick={resultPage}>Results</Button> : null}
        </div>
        {gameMode ? null : (
          <audio
            className="speakIt-audio"
            src={activeWordParams ? `${gitDataUrl}/${activeWordParams?.audio}` : null}
          >
            <track kind="captions" />
          </audio>
        )}
      </div>
      <div className={`speakIt-result ${!gameResult ? 'invisible' : 'visible'}`}>
        <div className="resultpage">
          <div className="results-container">

            { buildStatisticErrors() }

            { buildStatisticErrors(false) }

            <p className="results-right">
              Rights:
              <span className="right-num">0</span>
            </p>
            <div className="right-item" />
          </div>
        </div>
        <div className="result-button__wrapper">
          <Button primary onClick={restart}>Restart</Button>
          <Button primary onClick={backToMain}>Back</Button>
        </div>
      </div>
    </>
  );
};

export default SpeackIt;
