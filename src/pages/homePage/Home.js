import React, { useState, useEffect } from 'react';
import WordCard from '../../components/wordCard/WordCard';
import wordController from '../../controllers/WordConrtoller';
import wordQueueSubject from '../../utils/observers/WordQueueSubject';
import statisticsSubject from '../../utils/observers/StatisticsSubject';
import settingsSubject from '../../utils/observers/SettingSubject';
import StatisticShort from '../../components/statisticShort/StatisticShort';
import statisticsController from '../../controllers/StatisticsController';
import Button from '../../components/button/Button';
import './Home.scss';
import settingsController from '../../controllers/SettingsController';
import settingsNames from '../../constants/settingsNames';

const initHelpSettings = {
  isImageShow: true,
  isTranscriptionShow: true,
  isWordTranslateShow: true,
  isTextExampleShow: true,
  isTextMeaningShow: true,
  isTranslateShow: true,
};

const initSettings = {
  isShowAnswerBtn: true,
  isDeleteBtn: true,
  isHardBtn: true,
  isComplexityBtn: true,
  isAudioAuto: true,
};

/**
 * @param {Object} param
 */
const Home = () => {
  wordController.init();
  const [wordQueue, setWordQueue] = useState(wordController.getQueue());
  const [word, setWord] = useState(wordQueue ? wordQueue.getCurrentWord() : null);
  const [wordDifficulty, setWordDifficulty] = useState(wordQueue ? wordQueue.getCurrentWord().word.getDifficulty() : null);
  const updateWordQueue = (wQueue) => {
    setWordQueue(wQueue);
    setWord(wQueue.getCurrentWord());
    setWordDifficulty(wQueue.getCurrentWord().word.getDifficulty());
  };
  const [statistics, setStatistics] = useState(statisticsController.get());
  const [settings, setSettings] = useState(settingsController.get());

  useEffect(() => {
    wordQueueSubject.subscribe(updateWordQueue);
    statisticsSubject.subscribe(setStatistics);
    settingsSubject.subscribe(setSettings);
    return () => {
      wordQueueSubject.unsubscribe(updateWordQueue);
      statisticsSubject.unsubscribe(setStatistics);
      settingsSubject.unsubscribe(setSettings);
    };
  }, [setStatistics]);

  if (settings) {
    const [card, , buttons] = settings;
    console.log(card);
    console.log(buttons);
    console.log(settingsNames);
  }

  const handleNextBtnClick = () => {
    setWord(wordQueue.changeWord());
  };

  const handlePrevBtnClick = () => {
    setWord(wordQueue.getPreviousWord());
  };


  if (wordQueue && wordQueue.getLength() <= wordQueue.queuePointer) {
    return (
      <div className="main-game__end-game">
        <StatisticShort statistics={statistics !== null ? statistics : undefined} />
        <Button
          id="restartMainGame"
          name="restartMainGame"
          label="Restart"
          buttonClassName="main-game__end-game_button"
          clickHandler={wordQueue.reset}
        />
      </div>
    );
  }
  if (!word) {
    return (
      <div className="spinner">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }
  return (
    <div>
      <WordCard
        currentWord={word.word}
        wordQueue={wordQueue}
        helpSettings={initHelpSettings}
        settings={initSettings}
        onAgainBtnClick={wordQueue.setAgain}
        onComplexityBtnClick={(id) => { wordQueue.setWordDifficulty(id); setWordDifficulty(word.word.getDifficulty()); }}
        onDeleteBtnClick={wordQueue.setWordDeleted}
        onNextBtnClick={handleNextBtnClick}
        onPrevBtnClick={handlePrevBtnClick}
        isEducation={word.isEducation}
        wordDifficulty={word.word.getDifficulty()}
        isAnswered={wordQueue.isCurrentWordAnswered()}
        onWordAnswered={wordQueue.setWordAnswered}
        onWordMistaken={wordQueue.setWordMistaken}
        hasPrevious={wordQueue.hasPreviousWord()}
      />
      <span>{`${wordQueue.getCurrentPosition()} out of ${wordQueue.getLength()}`}</span>
    </div>
  );
};

export default Home;
