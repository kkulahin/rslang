import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Icon, Transition,
} from 'semantic-ui-react';
import {
  TimelineLite, Linear,
} from 'gsap/all';

import './savanna.scss';
import ReactCountDown from 'react-countdown-clock';
import { getWords } from '../../../../controllers/words/words';

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
  const [option, setOption] = useState(optionDef);
  const [kit, setKit] = useState([]);
  const [wordsForPlay, setGameWords] = useState([]);
  const [transitionWord] = useState(transtionWordDef);
  const [cKitStage, setCurKitStage] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [gameWordAnimation, setGameWordAnimation] = useState(null);
  const [nextWordCb, setNextWordCb] = useState(false);

  const curGameWord = useRef(null);
  const gameWindow = useRef(null);

  const redirectToGame = () => {
    const gameScreen = {
      start: true,
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
    setOption(optionDef);
    setKit([]);
    setGameWords([]);
    setCurKitStage([]);
    setAnswer(null);
    /* setGameWordAnimation(null); */
    setScreen(gameScreen);
  };

  const buildLifeElement = () => {
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
      <div
        key={e}
        className="word"
        data-translate={isEmptyArr(cKitStage) ? null : cKitStage[index].wordTranslate}
        onClick={checkAnswer}
        role="presentation"
      >
        {' '}
        {`${index + 1}: ${isEmptyArr(cKitStage) ? null : cKitStage[index].wordTranslate}`}
      </div>
    ));
    return <div className="savanna-wordpanel">{gameplayWords}</div>;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const getWordsForGame = () => {
      const wordsPromise = [];
      // words for game * 4 = total words
      // total words / 20 = request pages
      for (let stage = 0; stage <= 4; stage += 1) {
        wordsPromise.push(getWords(0, 0, true));
      }
      let totalWords = [];
      Promise.all(wordsPromise).then((resps) => {
        resps.forEach((r) => {
          totalWords = [...totalWords, ...r.data];
        });
        setKit(totalWords);
      });
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
  });

  useEffect(() => {
    if (option.curLife === 0) {
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
    const newGameWords = shuffleArray(kit).slice(0, optionDef.maxWords);
    setGameWords(newGameWords);
  }, [kit]);

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
        option.timer,
        { y: gameWindow.current.offsetHeight, onComplete: nextWordByTimeOut });
      gameWordAnimation.restart();
    }
  }, [answer, gameWordAnimation, option.timer, screen.game, option, wordsForPlay]);

  const getGameWord = () => {
    if (answer !== null) {
      return answer.word;
    }
    return null;
  };

  const getSuccessRate = () => {
    const persent = ((option.maxWords - wordsForPlay.length) / option.maxWords) * 100;
    return Math.round(persent);
  };

  const startPreloadTimer = () => {
    setTimer(true);
  };

  return (
    <>
      <div className={`savanna-startpage ${screen?.start ? 'visible' : 'invisible'}`}>
        { timer ? null : (<Button primary onClick={startPreloadTimer}> Start</Button>) }
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
        <div className="user-result">
          <div>
            {' '}
            Errors:
            {option.maxLife - option.curLife}
          </div>
          <div>
            {' '}
            Success rate %:
            {getSuccessRate()}
          </div>
        </div>
        <Button primary onClick={redirectToStart}> Try again?</Button>
      </div>
    </>
  );
};

export default Savanna;
