import Word from './Word';
import WordDefinition from './WordDefinition';
import statisticsController from '../../controllers/StatisticsController';
import { getTodaySeconds } from '../time';
import wordController from '../../controllers/WordConrtoller';
import settingsController from '../../controllers/SettingsController';
import settingsNames from '../../constants/settingsNames';
import wordQueueSubject from '../observers/WordQueueSubject';
import settingsWordCountSubject from '../observers/SettingWordCountSubject';

export default class WordQueue {
  constructor() {
    /** @type {[Word]} */
    this.words = [];
    this.queue = [];
    this.repeatCount = 0;
    this.queuePointer = 0;
    this.lastAnswered = -1;
    this.needAnUpdate = false;
    settingsWordCountSubject.subscribe(this.confirmReset);
  }

  static queueSort = (queueWord1, queueWord2) => queueWord1.nextTime - queueWord2.nextTime;

  /**
   * create a new queue of the words
   * @param {[{}]} words array of flat words ( new or already prepared for this day)
   * @param {[{}]} userWords array of flat words (if not specified words will be treted as today words)
   */
  makeQueue = (newWords, userWords) => {
    const maxNewWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.newWords);
    if (newWords.length > maxNewWords) {
      newWords.splice(maxNewWords, newWords.length - maxNewWords);
    }
    newWords.forEach((word) => this.words.push(new Word(this, new WordDefinition(word), {})));
    const pontentialWords = [];
    const potentialQueue = [];
    userWords.forEach((word) => {
      const wordConfigs = word.userWord && word.userWord.optional ? word.userWord.optional : {};
      pontentialWords.push(new Word(this, new WordDefinition(word), wordConfigs));
    });
    WordQueue.fillQueue(pontentialWords, potentialQueue);
    WordQueue.fillQueue(this.words, this.queue);
    this.filterUserWordsByCount(pontentialWords, potentialQueue);
  }

  /**
   * create a new queue of the words
   * @param {Object} queueSettings queue settings
   * @param {[number]} queueSettings.queue array of word ids
   * @param {number} queueSettings.pointer queue length
   * @param {[{}]} words array of flat words ( new or already prepared for this day)
   */
  usePredefinedQueue = (queueSettings, words) => {
    this.words = words.map((w) => new Word(this, new WordDefinition(w),
      w.userWord && w.userWord.optional ? w.userWord.optional : {}));
    // TODO: uncomment 2 lines
    this.queuePointer = queueSettings.pointer;
    this.lastAnswered = queueSettings.pointer - 1;
    this.needAnUpdate = queueSettings.hasUpdate;
    queueSettings.queue.forEach((qWord) => {
      const [word] = this.words.filter((w) => qWord.w === w.definition.word);
      this.queue.push({ word, isEducation: qWord.isEd, isAgain: qWord.isA });
    });
  };

  confirmReset = () => {
    this.needAnUpdate = null;
    const isQueueStarted = this.lastAnswered >= 0;
    if (isQueueStarted) {
      // notify user you will reset the current queue
      this.needAnUpdate = confirm('You have started today learning. Do you want to recreate today game?');
    }
    if (!isQueueStarted || this.needAnUpdate) {
      this.needAnUpdate = true;
      this.words = [];
      wordQueueSubject.notify(this);
      statisticsController.resetToday();
    }
  }

  updateQueue = async () => {
    this.words = [];
    this.queue = [];
    this.repeatCount = 0;
    this.queuePointer = 0;
    this.lastAnswered = -1;
    await wordController.makeQueue();
  }

  static fillQueue = (words, queue) => {
    words.forEach((word) => WordQueue.addToQueueIfNeeded(word, queue));
  }

  filterUserWordsByCount = (userWords, potentialQueue) => {
    const maxCards = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.allWords);
    const maxCount = maxCards - this.queue.length;
    let newUserWords = userWords;
    potentialQueue.sort(WordQueue.queueSort);
    let queueToAdd = potentialQueue.filter((queueWord) => userWords.includes(queueWord.word));
    while (queueToAdd.length > maxCount) {
      const { word: lastWord } = queueToAdd.pop();
      queueToAdd = queueToAdd.filter(({ word }) => word !== lastWord);
      newUserWords = newUserWords.filter((word) => word !== lastWord);
    }
    this.queue.push(...queueToAdd);
    this.words.push(...newUserWords);
    this.queue.sort(WordQueue.queueSort);
    console.log(this.queue.map(({ word }, i) => i+ ". " + word.definition.word));
    console.log(this.words.map((word, i) => i+ ". " + word.definition.word));
  }

  /**
   * @returns {{isEducation: boolean, word: Word}} queued word
   */
  getCurrentWord = () => {
    if (this.needAnUpdate === null) {
      this.needAnUpdate = confirm('You have started today learning. Do you want to recreate today game?');
    }
    if (this.needAnUpdate) {
      this.updateQueue();
      return null;
    }
    return this.queue[this.queuePointer];
  };

  setWordMistaken = () => {
    const qWord = this.getCurrentWord();
    const { word, isEducation } = qWord;
    this.queue.push(qWord);
    word.setMistake();
    const isNew = word.isNew();
    word.downgradeDifficulty();
    if (isEducation) {
      word.upgradePhase();
    }
    this.updateStatistics(false, isNew);
    this.updateWord(isNew);
  }

  setAgain = () => {
    const qWord = { ...this.getCurrentWord() };
    qWord.isAgain = true;
    this.queue.push(qWord);
  };

  setWordAnswered = () => {
    const { word, isEducation } = this.getCurrentWord();
    word.setTime();
    const isNew = word.isNew();
    if (!isEducation || isNew) {
      word.upgradeDifficulty();
    }
    if (isEducation) {
      word.upgradePhase();
    }
    this.updateStatistics(true, isNew);
    this.updateWord(isNew);
  }

  /**
   * @param {boolean} value
   */
  setWordDeleted = (value) => {
    this.getCurrentWord().word.isDeleted = value;
    this.hasWordDeleted = value;
  }

  setWordDifficulty = (name) => {
    this.getCurrentWord().word.setDifficulty(name);
    this.updateWord();
  }

  changeWord = () => {
    if (this.hasWordDeleted) {
      const { word: deletedWord } = this.getCurrentWord();
      const [nextWord] = this.queue.filter((qWord, i) => i > this.queuePointer && qWord.word !== deletedWord);
      this.queue = this.queue.filter(({ word }) => word !== deletedWord);
      this.words = this.words.filter((word) => word !== deletedWord);
      if (nextWord) {
        this.queuePointer = this.queue.indexOf(nextWord);
      } else {
        this.queuePointer = this.queue.length;
      }
      this.hasWordDeleted = false;
    } else {
      this.queuePointer += 1;
      if (this.queuePointer > this.lastAnswered + 1) {
        this.lastAnswered += 1;
      }
    }
    return this.queue[this.queuePointer];
  }

  hasPreviousWord = () => (this.queuePointer > 0);

  getPreviousWord = () => {
    if (this.hasPreviousWord()) {
      this.queuePointer -= 1;
    }
    return this.getCurrentWord();
  }

  isCurrentWordAnswered = () => this.lastAnswered >= this.queuePointer;

  static addToQueueIfNeeded = (word, queue) => {
    const educationTimes = word.getNextEducationTime();
    const repetitionTime = word.getNextRepetitionTime();
    if (repetitionTime) {
      queue.push({ word, isEducation: false, nextTime: repetitionTime });
    }
    educationTimes.forEach((time) => {
      if (!repetitionTime) {
        queue.push({ word, isEducation: true, nextTime: time - 1000 * Math.random(20) });
        queue.push({ word, isEducation: false, nextTime: time + 1000 * Math.random(20) });
      } else {
        queue.push({ word, isEducation: true, nextTime: time });
      }
    });
  }

  getTodayWords = () => this.words.map((word) => word.definition.wordId);

  getLength = () => this.queue.length;

  getCurrentLength = () => this.queue.length - this.queuePointer;

  getCurrentPosition = () => this.queuePointer + 1;

  /**
   * @returns {{queue:[{w:string,isEd:boolean}],pointer:number,date:number}} queue
   */
  getQueueToSave= (isReset = false) => {
    const seconds = getTodaySeconds();
    if (isReset) {
      this.queue = this.queue.filter((qWord) => !qWord.isAgain);
    }
    return {
      queue: this.queue.map((qWord) => {
        const saveWord = { w: qWord.word.definition.word, isEd: qWord.isEducation };
        if (qWord.isAgain) {
          saveWord.isA = qWord.isAgain;
        }
        return saveWord;
      }),
      pointer: this.queuePointer,
      date: seconds,
      hasUpdate: this.needAnUpdate,
    };
  };

  /**
   * @param {boolean} isAnswered
   */
  updateStatistics = async (isAnswered, isNew) => {
    const { word, isEducation } = this.getCurrentWord();
    const isLast = !this.queue.some((qWord, index) => qWord.word === word && index > this.queuePointer);
    return statisticsController.updateAll(isEducation, isAnswered, isNew, isLast, this.getQueueToSave());
  }

  updateWord = async (isNew) => {
    let isNewWord = isNew;
    const { word } = this.getCurrentWord();
    if (isNew === undefined) {
      isNewWord = word.isNew();
    }
    return wordController.updateWord(word, isNewWord);
  }

  reset = async () => {
    this.queuePointer = 0;
    this.lastAnswered = -1;
    await statisticsController.resetQueue(this.getQueueToSave(true));
    wordQueueSubject.notify(this);
  }

  getWords= () => this.words;
}
