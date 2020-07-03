import React, { useState, useEffect } from 'react';
import WordCard from '../components/wordCard/WordCard';
import wordController from '../controllers/WordConrtoller';
import wordQueueSubject from '../utils/observers/WordQueueSubject';

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
  useEffect(() => {
    wordQueueSubject.subscribe(updateWordQueue);
    return () => {
      wordQueueSubject.unsubscribe(updateWordQueue);
    };
  });

  const handleNextBtnClick = () => {
    setWord(wordQueue.changeWord());
  };

  const handlePrevBtnClick = () => {
    setWord(wordQueue.getPreviousWord());
  };

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
        onErrorAnswer={() => console.log('------ error answer ------')}
        onHardBtnClick={() => console.log('------ hard btn click ------')}
        onComplexityBtnClick={(id) => console.log(`------ complexity btn click ${id} ------`)}
        onDeleteBtnClick={() => console.log('------ delete btn click ------')}
        onNextBtnClick={handleNextBtnClick}
        onPrevBtnClick={handlePrevBtnClick}
        isEducation={word.isEducation}
        isAnswered={wordQueue.isCurrentWordAnswered()}
        onWordAnswered={wordQueue.setWordAnswered}
        onWordMistaken={wordQueue.setWordMistaken}
        hasPrevious={wordQueue.hasPreviousWord()}
      />
    </div>
  );
};

export default Home;
