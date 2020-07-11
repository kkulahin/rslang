import Word from './Word';
import WordDefinition from './WordDefinition';
import statisticsController from '../../controllers/StatisticsController';
import { getTodaySeconds } from '../time';
import wordController from '../../controllers/WordConrtoller';
import settingsController from '../../controllers/SettingsController';
import settingsNames from '../../constants/settingsNames';
import wordQueueSubject from '../observers/WordQueueSubject';

export default class WordQueue {
  constructor() {
    /** @type {[Word]} */
    this.words = [];
    this.queue = [];
    this.repeatCount = 0;
    this.queuePointer = 0;
    this.lastAnswered = -1;
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
    this.filterUserWordsByCount(potentialQueue);
    // do we need this?
    // this.words.forEach((w) => w.shiftMistakes());
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
    queueSettings.queue.forEach((qWord) => {
      const [word] = this.words.filter((w) => qWord.w === w.definition.word);
      this.queue.push({ word, isEducation: qWord.isEd });
    });
  };

  endQueue = () => {
    this.words.forEach((word) => {
      word.upgradeDifficulty();
      word.downgradeDifficulty();
      word.upgradePhase();
    });
  }

  static fillQueue = (words, queue) => {
    words.forEach((word) => WordQueue.addToQueueIfNeeded(word, queue));
  }

  filterUserWordsByCount = (potentialQueue) => {
    const maxNewWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.newWords);
    const maxWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.allWords);
    const maxCount = maxWords - maxNewWords;
    const userWords = [];
    potentialQueue.sort(WordQueue.queueSort);
    potentialQueue.forEach((queueWord) => {
      if (!userWords.includes(queueWord.word)) {
        userWords.push(queueWord.word);
      }
    });
    userWords.length = userWords.length < maxCount ? userWords.length : maxCount;
    const queueToAdd = potentialQueue.filter((queueWord) => userWords.includes(queueWord.word));
    this.queue.push(...queueToAdd);
    this.words.push(...userWords);
    this.queue.sort(WordQueue.queueSort);
  }

  /**
   * @returns {{isEducation: boolean, word: Word}} queued word
   */
  getCurrentWord = () => this.queue[this.queuePointer];

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
    const qWord = this.queue[this.queuePointer];
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
  }

  changeWord = () => {
    this.queuePointer += 1;
    if (this.queuePointer > this.lastAnswered + 1) {
      this.lastAnswered += 1;
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

  /**
   * @returns {{queue:[{w:string,isEd:boolean}],pointer:number,date:number}} queue
   */
  getQueueToSave= () => {
    const seconds = getTodaySeconds();
    return {
      queue: this.queue.map((qWord) => ({ w: qWord.word.definition.word, isEd: qWord.isEducation })),
      pointer: this.queuePointer + 1,
      date: seconds,
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
    const { word } = this.getCurrentWord();
    return wordController.updateWord(word, isNew);
  }

  reset = async () => {
    console.log('do reset');
    this.queuePointer = 0;
    this.lastAnswered = -1;
    await statisticsController.resetQueue(this.getQueueToSave());
    wordQueueSubject.notify(this);
  }

  getWords= () => this.words;
}
