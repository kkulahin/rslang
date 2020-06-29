import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WordCard from '../components/wordCard/WordCard';
import WordController from '../utils/spacedRepetition/WordConrtoller';
import wordQueueSubject from '../utils/observers/WordQueueSubject';
import WordQueue from '../utils/spacedRepetition/WordQueue';

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

const initWords = [
  {
    id: '1',
    group: 0,
    page: 0,
    word: 'alcohol',
    image: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002.jpg',
    audio: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002.mp3',
    audioMeaning: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002_meaning.mp3',
    audioExample: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002_example.mp3',
    textMeaning: '<i>Alcohol</i> is a type of drink that can make people drunk.',
    textExample: 'A person should not drive a car after he or she has been drinking <b>alcohol</b>.',
    transcription: '[ǽlkəhɔ̀ːl]',
    textExampleTranslate: 'Человек не должен водить машину после того, как он выпил алкоголь',
    textMeaningTranslate: 'Алкоголь - это тип напитка, который может сделать людей пьяными',
    wordTranslate: 'алкоголь',
    wordsPerExampleSentence: 15,
    complexity: 'снова',
    isHard: true,
  },
  {
    id: '2',
    group: 0,
    page: 0,
    word: 'boat',
    image: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005.jpg',
    audio: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005.mp3',
    audioMeaning: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005_meaning.mp3',
    audioExample: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005_example.mp3',
    textMeaning: 'A <i>boat</i> is a vehicle that moves across water.',
    textExample: 'There is a small <b>boat</b> on the lake.',
    transcription: '[bout]',
    textExampleTranslate: 'На озере есть маленькая лодка',
    textMeaningTranslate: 'Лодка - это транспортное средство, которое движется по воде',
    wordTranslate: 'лодка',
    wordsPerExampleSentence: 8,
    complexity: 'трудно',
    isHard: false,
  },
  {
    id: '3',
    group: 0,
    page: 0,
    word: 'agree',
    image: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg',
    audio: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.mp3',
    audioMeaning: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_meaning.mp3',
    audioExample: 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_example.mp3',
    textMeaning: 'To <i>agree</i> is to have the same opinion or belief as another person.',
    textExample: 'The students <b>agree</b> they have too much homework.',
    transcription: '[əgríː]',
    textExampleTranslate: 'Студенты согласны, что у них слишком много домашней работы',
    textMeaningTranslate: 'Согласиться - значит иметь то же мнение или убеждение, что и другой человек',
    wordTranslate: 'согласна',
    wordsPerExampleSentence: 8,
    complexity: 'хорошо',
    isHard: true,
  },
];

/**
 * @param {Object} param
 * @param {WordController} param.wordController word controller
 */
const Home = ({ wordController }) => {
  const [word, setWord] = useState(null);
  const [wordQueue, setWordQueue] = useState(wordController.getQueue());
  const updateWordQueue = (wQueue) => {
    setWordQueue(wQueue);
    setWord(wQueue.getCurrentWord());
  };
  useEffect(() => {
    wordQueueSubject.subscribe(updateWordQueue);
    return () => wordQueueSubject.unsubscribe(updateWordQueue);
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

Home.propTypes = {
  wordController: PropTypes.instanceOf(WordController).isRequired,
};

export default Home;
