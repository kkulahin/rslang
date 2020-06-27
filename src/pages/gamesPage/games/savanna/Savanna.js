import React, { useState, useEffect, useRef } from 'react';
import {
  Icon, Transition,
} from 'semantic-ui-react';
import {
  TimelineLite, Linear,
} from 'gsap/all';
import ReactCountDown from 'react-countdown-clock';
import ShadowContainer from '../../../../components/containerWithShadow/ContainerWithShadow';

import './savanna.scss';
import { getWords } from '../../../../controllers/words/words';

import RadioButton from '../../../../components/radioButton/radioButtonContainer/RadioButtonContainer';
import Button from '../../../../components/button/Button';
import gameOption from './gameOption';

const gameScreenDef = {
  start: true,
  game: false,
  result: false,
};

const optionDef = {
  curLife: 5,
  maxLife: 5,
  maxWords: 25,
  timer: 10,
};

const requestWordsPerPage = 20;

const shuffleArray = (arr) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const isEmptyArr = (arr) => {
  if (Array.isArray(arr) && !arr.length) {
    return true;
  }
  return false;
};

const transtionWordDef = {
  animation: 'slide down',
  duration: 100,
  visible: true,
};

const Savanna = () => {
  const [screen, setScreen] = useState(gameScreenDef);
  const [timer, setTimer] = useState(false);
  const [option, setOption] = useState(null);
  const [kit, setKit] = useState([]);
  const [setupKitSingleton, setKitSingleton] = useState(false);
  const [wordsForPlay, setGameWords] = useState([]);
  const [transitionWord] = useState(transtionWordDef);
  const [cKitStage, setCurKitStage] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [gameWordAnimation, setGameWordAnimation] = useState(null);
  const [nextWordCb, setNextWordCb] = useState(false);
  const [level, setLevel] = useState(null);

  const curGameWord = useRef(null);
  const gameWindow = useRef(null);
  let gameLevel = useRef(null);

  const redirectToGame = () => {
    const gameScreen = {
      start: false,
      game: true,
      result: false,
    };
    setScreen(gameScreen);
    setTimer(false);
  };

  const redirectToStart = () => {
    const gameScreen = {
      start: true,
      game: false,
      result: false,
    };
    setLevel(null);
    gameLevel = null;
    setOption(optionDef);
    setKit([]);
    setGameWords([]);
    setCurKitStage([]);
    setAnswer(null);
    setKitSingleton(false);
    /* setGameWordAnimation(null); */
    setScreen(gameScreen);
  };

  const buildLifeElement = () => {
    if (option === null) return null;
    const { curLife, maxLife } = option;
    const life = Array.from({ length: curLife }, () => 'heart');
    const damage = Array.from({ length: maxLife - curLife }, () => 'heart outline');
    const userHealth = [...life, ...damage];
    const lifepanel = userHealth.map((healthIcon, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Icon key={`index${index}`} className={healthIcon} />
    ));
    return <>{lifepanel}</>;
  };

  const checkAnswer = (e) => {
    const el = e.target;
    const userAnswer = el.getAttribute('data-translate');
    if (answer.wordTranslate === userAnswer) {
      const newWordsForPlay = wordsForPlay.slice(0, wordsForPlay.length - 1);
      setGameWords(newWordsForPlay);
    } else {
      setGameWords(shuffleArray(wordsForPlay));
      const newOption = { ...option, curLife: option.curLife - 1 };
      setOption(newOption);
    }
  };

  const buildGameplayWords = () => {
    const elements = Array.from({ length: 4 }, (v, k) => k); // depends from difficult
    const gameplayWords = elements.map((e, index) => (
      <Button
        key={e}
        id={`${e}-savanna-btn`}
        buttonClassName="word"
        clickHandler={checkAnswer}
        data-translate={isEmptyArr(cKitStage) ? null : cKitStage[index].wordTranslate}
        label={`${index + 1}: ${isEmptyArr(cKitStage) ? null : cKitStage[index].wordTranslate}`}
        name="check"
      />
    ));
    return <div className="savanna-wordpanel">{gameplayWords}</div>;
  };

  useEffect(() => {
    const getWordsForGame = () => {
      if (option === null) {
        return null;
      }
      const wordsPromise = [];
      const totalWordsNumber = option.maxWords * 4;
      const stageMax = totalWordsNumber / requestWordsPerPage;
      for (let stage = 0; stage <= stageMax; stage += 1) {
        wordsPromise.push(getWords(0, 0, true, true));
      }
      let totalWords = [];
      Promise.all(wordsPromise).then((resps) => {
        resps.forEach((r) => {
          totalWords = [...totalWords, ...r.data];
        });
        setKit(totalWords);
      });
      return null;
    };
    if (Array.isArray(kit) && !kit.length) {
      getWordsForGame();
    }
    if (gameWordAnimation === null) {
      const timeLine = new TimelineLite({
        paused: true,
        default: { ease: Linear },
      }).from(gameWindow.current, { y: 0 });
      setGameWordAnimation(timeLine);
    }
    return undefined;
  }, [kit, gameWordAnimation, option]);

  useEffect(() => {
    if (option?.curLife === 0) {
      gameWordAnimation.pause();
      const gameScreen = {
        start: false,
        game: false,
        result: true,
      };
      setScreen(gameScreen);
    }
  }, [option, gameWordAnimation]);

  useEffect(() => {
    if (option !== null && !isEmptyArr(kit) && !setupKitSingleton) {
      const newGameWords = shuffleArray(kit).slice(0, option.maxWords);
      setGameWords(newGameWords);
      setKitSingleton(true);
    }
  }, [kit, option, setupKitSingleton]);

  useEffect(() => {
    if (Array.isArray(wordsForPlay) && wordsForPlay.length) {
      const cWord = wordsForPlay.slice(-1)[0];
      setAnswer(cWord);
    }
    if (!wordsForPlay.length && answer !== null) {
      gameWordAnimation.pause();
      const gameScreen = {
        start: false,
        game: false,
        result: true,
      };
      setScreen(gameScreen);
    }
  }, [wordsForPlay, answer, gameWordAnimation]);

  useEffect(() => {
    if (answer !== null) {
      const rightAnswerIndex = kit.findIndex((e) => e.word === answer.word);
      const newKit = shuffleArray([...kit.slice(0, rightAnswerIndex), ...kit.slice(rightAnswerIndex + 1)]);
      const saltWords = newKit.slice(0, 3); // depens from difficults
      const gameplayWords = shuffleArray([...saltWords, answer]);
      setCurKitStage(gameplayWords);
    }
  }, [answer, kit]);

  useEffect(() => {
    if (nextWordCb && screen.game) {
      setNextWordCb(false);
      setGameWords(shuffleArray(wordsForPlay));
      const newOption = { ...option, curLife: option.curLife - 1 };
      setOption(newOption);
    }
    if (!screen.game && gameWordAnimation !== null) {
      gameWordAnimation.pause();
    }
  }, [nextWordCb, option, wordsForPlay, screen, gameWordAnimation]);

  useEffect(() => {
    const nextWordByTimeOut = () => {
      setNextWordCb(true);
    };

    if (answer !== null && gameWordAnimation !== null && screen.game) {
      gameWordAnimation.to(curGameWord.current,
        option.gameTimer,
        { y: gameWindow.current.offsetHeight, onComplete: nextWordByTimeOut });
      gameWordAnimation.restart();
    }
  }, [answer, gameWordAnimation, option?.timer, screen.game, option, wordsForPlay]);

  const getGameWord = () => {
    if (answer !== null) {
      return answer.word;
    }
    return null;
  };

  const getSuccessRate = () => {
    const errors = option?.maxLife - option?.curLife;
    const persent = ((option?.maxWords - wordsForPlay.length) / option?.maxWords) * 100;
    return Math.round(persent / (errors === 0 ? 1 : 0));
  };

  const startPreloadTimer = () => {
    const changeGameSettings = () => {
      const optionDeff = gameOption[level];
      const curLife = gameOption[level].maxLife;
      const newOptionDef = {
        ...optionDeff,
        curLife,
      };
      setOption(newOptionDef);
    };
    changeGameSettings();
    setTimer(true);
  };

  const setLevelType = (e, type) => {
    if (gameLevel.current !== e.currentTarget.parentElement) {
      if (gameLevel.current !== null) {
        const el = gameLevel.current.querySelector('.radio-button--checked');
        if (el !== null) {
          el.click();
        }
      }
      gameLevel.current = e.currentTarget.parentElement;
    }

    if (level !== type) {
      setLevel(type);
    }

    if (level === type) {
      setLevel(null);
    }
  };
  return (
    <>

      <div className={`savanna-startpage ${screen?.start ? 'visible' : 'invisible'}`}>
        {
timer ? null : (
  <ShadowContainer>

    <div
      className="savanna-gamelevel"
    >
      <RadioButton
        className="savanna-level level-default"
        items={['easy', 'normal', 'hard']}
        onChange={setLevelType}
      />
      <RadioButton
        className="savanna-level level-hardmode"
        items={['YOLO']}
        onChange={setLevelType}
      />
    </div>

    { timer ? null : (
      <Button
        label="start"
        id="savanna-start-btn"
        name="check"
        buttonClassName="savanna-start"
        clickHandler={startPreloadTimer}
        isDisabled={level === null}
      />
    ) }
  </ShadowContainer>
)
}

        { !timer ? null : (
          <ReactCountDown
            color="#25cede"
            alpha={0.9}
            seconds={7}
            weight={40}
            showMilliseconds={false}
            size={300}
            onComplete={redirectToGame}
          />
        )}
      </div>
      <div className={`savanna-gamepage ${screen?.game ? 'visible' : 'invisible'}`}>
        <div className="savanna-gamepanel">
          <div className="gamepanel-hitpoint">
            {buildLifeElement()}
          </div>
          <Icon className="reply" onClick={redirectToStart} />
        </div>
        <div ref={gameWindow} className="savanna-main">
          <Transition.Group animation={transitionWord.animation} duration={transitionWord.duration}>
            <div ref={curGameWord} className="savanna-gameword">{ getGameWord()}</div>
          </Transition.Group>
          { buildGameplayWords() }
        </div>
      </div>
      <div className={`savanna-resultpage ${screen?.result ? 'visible' : 'invisible'}`}>
        <ShadowContainer>
          <div className="user-result">
            <div>
              {' '}
              Errors:
              {option?.maxLife - option?.curLife}
            </div>
            <div>
              {' '}
              Success rate %:
              {getSuccessRate()}
            </div>
          </div>
        </ShadowContainer>

        <Button
          clickHandler={redirectToStart}
          id="savanna-again-btn"
          label="Try again?"
          name="check"
        />
      </div>
    </>
  );
};

export default Savanna;
