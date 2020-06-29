import React, { useState, useEffect } from 'react';
import {
  Button, Icon,
} from 'semantic-ui-react';

import './savanna.scss';
import { getWords } from '../../../../controllers/words/words';

const gameScreenDef = {
  start: true,
  game: true,
  result: false,
};

const optionDef = {
  curLife: 5,
  maxLife: 5,
  maxWords: 25,
};

const shuffleArray = (arr) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const isEmptyArr = (arr) => {
  if (Array.isArray(arr) && !arr.length) {
    return true;
  }
  return false;
};

const Savanna = () => {
  const [screen, setScreen] = useState(gameScreenDef);
  const [option, setOption] = useState(optionDef);
  const [kit, setKit] = useState([]);
  const [wordsForPlay, setGameWords] = useState([]);
  const [cKitStage, setCurKitStage] = useState([]);
  const [answer, setAnswer] = useState(null);

  const redirectToGame = () => {
    const gameScreen = {
      start: false,
      game: true,
      result: false,
    };
    setScreen(gameScreen);
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
  });

  useEffect(() => {
    if (option.curLife === 0) {
      const gameScreen = {
        start: false,
        game: false,
        result: true,
      };
      setScreen(gameScreen);
    }
  }, [option]);

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
      const gameScreen = {
        start: false,
        game: false,
        result: true,
      };
      setScreen(gameScreen);
    }
  }, [wordsForPlay, answer]);

  useEffect(() => {
    if (answer !== null) {
      const rightAnswerIndex = kit.findIndex((e) => e.word === answer.word);
      const newKit = shuffleArray([...kit.slice(0, rightAnswerIndex), ...kit.slice(rightAnswerIndex + 1)]);
      const saltWords = newKit.slice(0, 3); // depens from difficults
      const gameplayWords = shuffleArray([...saltWords, answer]);
      setCurKitStage(gameplayWords);
    }
  }, [answer, kit]);

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

  return (
    <>
      <div className={`savanna-startpage ${screen?.start ? 'visible' : 'invisible'}`}>
        <Button primary onClick={redirectToGame}> Start</Button>
      </div>
      <div className={`savanna-gamepage ${screen?.game ? 'visible' : 'invisible'}`}>
        <div className="savanna-gamepanel">
          <div className="gamepanel-hitpoint">
            {buildLifeElement()}
          </div>
          <Icon className="reply" onClick={redirectToStart} />
        </div>
        <div className="savanna-main">
          <div className="savanna-gameword">{ getGameWord() }</div>
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
