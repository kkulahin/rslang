import React, { useState, useEffect } from 'react';
import WordCard from '../../components/wordCard/WordCard';
import wordController from '../../controllers/WordConrtoller';
import wordQueueSubject from '../../utils/observers/WordQueueSubject';
import statisticsSubject from '../../utils/observers/StatisticsSubject';
import StatisticShort from '../../components/statisticShort/StatisticShort';
import statisticsController from '../../controllers/StatisticsController';
import Button from '../../components/button/Button';
import './Home.scss';

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
  const updateWordQueue = (wQueue) => {
    setWordQueue(wQueue);
    setWord(wQueue.getCurrentWord());
  };
  const [statistics, setStatistics] = useState(statisticsController.get());

  useEffect(() => {
    wordQueueSubject.subscribe(updateWordQueue);
    statisticsSubject.subscribe(setStatistics);
    return () => {
      wordQueueSubject.unsubscribe(updateWordQueue);
      statisticsSubject.unsubscribe(setStatistics);
    };
  }, [setStatistics]);

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
    return (<div>Loading...</div>);
  }
  return (
    <div>
      <WordCard
        currentWord={word.word}
        wordQueue={wordQueue}
        helpSettings={initHelpSettings}
        settings={initSettings}
        onAgainBtnClick={wordQueue.setAgain}
        onHardBtnClick={() => console.log('------ hard btn click ------')}
        onComplexityBtnClick={(id) => console.log(`------ complexity btn click ${id} ------`)}
        onDeleteBtnClick={wordQueue.setWordDeleted}
        onNextBtnClick={handleNextBtnClick}
        onPrevBtnClick={handlePrevBtnClick}
        isEducation={word.isEducation}
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
