import React, { useState, useEffect } from 'react';
import WordCard from '../../components/wordCard/WordCard';
import wordController from '../../controllers/WordConrtoller';
import wordQueueSubject from '../../utils/observers/WordQueueSubject';
import statisticsSubject from '../../utils/observers/StatisticsSubject';
import settingsSubject from '../../utils/observers/SettingSubject';
import StatisticShort from '../../components/statisticShort/StatisticShort';
import statisticsController from '../../controllers/StatisticsController';
import Button from '../../components/button/Button';
import Dropdown from '../../components/dropdown/Dropdown';
import './Home.scss';
import settingsController from '../../controllers/SettingsController';
import getModifiedSettings from '../../components/wordCard/getModifiedSettings';
import WordQueue from '../../utils/spacedRepetition/WordQueue';
import wordsReloadedSubject from '../../utils/observers/WordsReloadedSubject';

/**
 * @param {Object} param
 */
const Home = () => {
  wordController.init();
  const [wordQueue, setWordQueue] = useState(wordController.getQueue());
  const [reloadWords, setWordsRealoaded] = useState(wordQueue === null);
  const [word, setWord] = useState(wordQueue && wordQueue.getCurrentWord() ? wordQueue.getCurrentWord() : null);
  const [wordDifficulty, setWordDifficulty] = useState(wordQueue ? wordQueue.getWordDifficulty() : null);
  const [isWordDeleted, setWordDeleted] = useState(wordQueue ? wordQueue.isWordDeleted() : false);
  /**
   * @param {WordQueue} wQueue
   */
  const updateWordQueue = (wQueue) => {
    setWordQueue(wQueue);
    setWordDifficulty(wQueue.getWordDifficulty());
    setWord(wQueue.getCurrentWord());
    setWordDeleted(wQueue.isWordDeleted());
  };
  const [statistics, setStatistics] = useState(statisticsController.get());
  const [settings, setSettings] = useState(settingsController.get());

  useEffect(() => {
    wordQueueSubject.subscribe(updateWordQueue);
    wordsReloadedSubject.subscribe(setWordsRealoaded);
    statisticsSubject.subscribe(setStatistics);
    settingsSubject.subscribe(setSettings);
    if (!reloadWords && wordQueue) {
      wordQueue.getUpdatedWords();
    }
    return () => {
      wordQueueSubject.unsubscribe(updateWordQueue);
      wordsReloadedSubject.unsubscribe(setWordsRealoaded);
      statisticsSubject.unsubscribe(setStatistics);
      settingsSubject.unsubscribe(setSettings);
    };
  }, [setStatistics, setSettings, setWordsRealoaded, reloadWords, wordQueue]);

  let cardSettings;
  if (settings) {
    cardSettings = getModifiedSettings(settings);
  }

  const handleNextBtnClick = () => {
    setWord(wordQueue.changeWord());
    setWordDeleted(wordQueue.isWordDeleted());
    setWordDifficulty(wordQueue.getWordDifficulty());
  };

  const handlePrevBtnClick = () => {
    setWord(wordQueue.getPreviousWord());
    setWordDeleted(wordQueue.isWordDeleted());
    setWordDifficulty(wordQueue.getWordDifficulty());
  };

  if (wordQueue && !word && wordQueue.getLength() <= wordQueue.getCurrentPosition() && wordQueue.getLength() > 0) {
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

  if (wordQueue && !word && wordQueue.getCurrentLength() > 0) {
    return (
      <div className="home-block__end-sub-queue">
        <h2>
          You have completed everything in category
          {' '}
          {WordQueue.getQueueTypes()[wordQueue.getQueueType()]}
          .
        </h2>
        <Button id="continueAllWords" label="Continue with all words" clickHandler={() => wordQueue.updateQueueType()} />
        <span>{`${wordQueue.getCurrentPosition()} out of ${wordQueue.getLength()}`}</span>
      </div>
    );
  }
  if (!word || !reloadWords) {
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
    <div className="home-block__card">
      <Dropdown
        values={WordQueue.getQueueTypes()}
        defaultValue={`${wordQueue.getQueueType()}`}
        onChange={(type) => wordQueue.updateQueueType(type)}
      />
      <WordCard
        currentWord={word.word}
        wordQueue={wordQueue}
        settings={cardSettings}
        onAgainBtnClick={wordQueue.setAgain}
        onComplexityBtnClick={(id) => { wordQueue.setWordDifficulty(id); setWordDifficulty(wordQueue.getWordDifficulty()); }}
        onDeleteBtnClick={(value) => { setWordDeleted(value); wordQueue.setWordDeleted(value); }}
        onNextBtnClick={handleNextBtnClick}
        onPrevBtnClick={handlePrevBtnClick}
        isEducation={word.isEducation}
        isWordDeleted={isWordDeleted}
        wordDifficulty={wordDifficulty}
        isAnswered={wordQueue.isCurrentWordAnswered()}
        onWordAnswered={wordQueue.setWordAnswered}
        onWordMistaken={wordQueue.setWordMistaken}
        hasPrevious={wordQueue.hasPreviousWord()}
      />
      <div className="home_progress_bar">
        <div
          className="line_progress"
          style={{
            width: `${(wordQueue.getCurrentPosition() * 100) / wordQueue.getLength()}% `,
            background: 'linear-gradient(0.25turn, rgba(37, 206, 222, 0.2), rgba(37, 206, 222, 0.8))',
            height: '100%',
            borderRadius: '25px',
          }}
        />
        <p className="total_words">{`${wordQueue.getCurrentPosition()} out of ${wordQueue.getLength()}`}</p>
      </div>
    </div>
  );
};

export default Home;
