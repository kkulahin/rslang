import Word from './Word';
import WordDefinition from './WordDefinition';
import statisticsController from '../../controllers/StatisticsController';
import { getTodaySeconds } from '../time';
import wordController from '../../controllers/WordConrtoller';
import settingsController from '../../controllers/SettingsController';
import settingsNames from '../../constants/settingsNames';
import wordQueueSubject from '../observers/WordQueueSubject';
import settingsWordCountSubject from '../observers/SettingWordCountSubject';
import parameters from './parameters';

export default class WordQueue {
  constructor() {
    /** @type {[Word]} */
    this.words = [];
    /** @type {[{word:Word, isAgain: boolean, isEducation: boolean, isDone: boolean}]} */
    this.queue = [];
    this.queuePointer = 0;
    this.needAnUpdate = false;
    this.subQueue = null;
    this.setQueueType();
    settingsWordCountSubject.subscribe(this.confirmReset);
  }

  static queueTypes = { all: 'All words', new: 'New Words', hard: 'Hard words' };

  static getQueueTypes = () => Object.values(WordQueue.queueTypes);

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
    this.needAnUpdate = queueSettings.hasUpdate;
    this.setQueueType(queueSettings.queueType);
    queueSettings.queue.forEach((qWord) => {
      const [word] = this.words.filter((w) => qWord.w === w.definition.word);
      this.queue.push({
        word, isEducation: qWord.isEd, isAgain: qWord.isA, isDone: qWord.isD,
      });
    });
    this.createSubQueue();
  };

  confirmReset = () => {
    this.needAnUpdate = null;
    const isQueueStarted = this.queue.some(({ isDone }) => isDone === true);
    if (isQueueStarted) {
      this.needAnUpdate = confirm('You have started today learning. Do you want to recreate today game?');
    }
    if (!isQueueStarted || this.needAnUpdate) {
      this.needAnUpdate = true;
      this.words = [];
      this.subQueue = null;
      this.setQueueType();
      wordQueueSubject.notify(this);
      statisticsController.resetToday();
    }
  }

  createSubQueue = (sendEvent = true) => {
    let queue = null;
    if (WordQueue.queueTypes.all === WordQueue.getQueueTypes()[this.queueType]) {
      this.subQueue = null;
      queue = this.queue;
    } else if (WordQueue.queueTypes.new === WordQueue.getQueueTypes()[this.queueType]) {
      this.subQueue = this.queue.filter(({ word }) => word.wasNewToday());
      queue = this.subQueue;
    } else {
      this.subQueue = this.queue.filter(({ word }) => word.getDifficulty() === parameters.difficultyNames.hard);
      queue = this.subQueue;
    }
    this.queuePointer = queue.reduce((fInd, { isDone }, i) => {
      if (isDone !== true && fInd === queue.length) {
        return i;
      }
      return fInd;
    }, queue.length);
    if (sendEvent) {
      wordQueueSubject.notify(this);
    }
  }

  updateQueue = async () => {
    this.words = [];
    this.queue = [];
    this.queuePointer = 0;
    this.needAnUpdate = false;
    this.subQueue = null;
    this.setQueueType();
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
    const queue = this.subQueue ? this.subQueue : this.queue;
    return queue[this.queuePointer];
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
    this.updateStatistics(false);
    this.updateWord(isNew);
  }

  setAgain = () => {
    const qWord = { ...this.getCurrentWord() };
    qWord.isAgain = true;
    qWord.isDone = false;
    this.queue.push(qWord);
    if (this.subQueue) {
      this.subQueue.push(qWord);
    }
  };

  setWordAnswered = () => {
    this.getCurrentWord().isDone = true;
    this.beforeChange = true;
    const { word, isEducation } = this.getCurrentWord();
    word.setTime();
    const isNew = word.isNew();
    if (!isEducation || isNew) {
      word.upgradeDifficulty();
    }
    if (isEducation) {
      word.upgradePhase();
    }
    this.updateStatistics(true);
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
    if (WordQueue.getQueueTypes()[this.queueType] === WordQueue.queueTypes.hard) {
      if (name === parameters.difficultyNames.hard) {
        this.newSubQueue = null;
      } else {
        this.subQueue = this.subQueue.filter(({ word }) => word.getDifficulty() === parameters.difficultyNames.hard);
      }
    }
  }

  isWordDeleted = () => this.hasWordDeleted === true;

  getWordDifficulty = () => (this.getCurrentWord()
    ? this.getCurrentWord().word.getDifficulty()
    : null);

  changeWord = () => {
    if (this.newSubQueue) {
      this.subQueue = this.newSubQueue;
      this.newSubQueue = null;
    }
    const isSubQueue = this.subQueue !== null;
    const queue = isSubQueue ? this.subQueue : this.queue;
    if (this.hasWordDeleted) {
      const { word: deletedWord } = this.getCurrentWord();
      const [nextWord] = queue.filter((qWord, i) => i > this.queuePointer && qWord.word !== deletedWord);
      this.queue = this.queue.filter(({ word }) => word !== deletedWord);
      if (isSubQueue) {
        this.subQueue = this.subQueue.filter(({ word }) => word !== deletedWord);
      }
      this.words = this.words.filter((word) => word !== deletedWord);
      if (nextWord) {
        this.queuePointer = queue.indexOf(nextWord);
      } else {
        this.queuePointer = queue.length;
      }
      this.hasWordDeleted = false;
      wordQueueSubject.notify(this);
    } else {
      this.queuePointer = queue.reduce((fInd, { isDone }, i) => {
        if (isDone !== true && fInd === queue.length) {
          return i;
        }
        return fInd;
      }, queue.length);
    }
    this.beforeChange = false;
    return queue[this.queuePointer];
  }

  hasPreviousWord = () => (this.queuePointer > 0);

  setQueueType = (i) => {
    if (i) {
      this.queueType = i;
    } else {
      this.queueType = WordQueue.getQueueTypes().indexOf(WordQueue.queueTypes.all);
    }
  };

  updateQueueType = (i) => {
    this.setQueueType(i);
    this.createSubQueue();
    return statisticsController.updateQueue(this.getQueueToSave());
  }

  getQueueType = () => this.queueType;

  getPreviousWord = () => {
    if (this.hasPreviousWord()) {
      this.queuePointer -= 1;
    }
    return this.getCurrentWord();
  }

  isCurrentWordAnswered = () => this.getCurrentWord() && this.getCurrentWord().isDone === true && !this.beforeChange;

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

  getCurrentLength = () => this.queue.reduce((count, { isDone }) => (isDone !== true ? count + 1 : count), 0);

  getCurrentPosition = () => this.queue.reduce((count, { isDone }) => (isDone === true ? count + 1 : count), 0);

  /**
   * @returns {{queue:[{w:string,isEd:boolean}],pointer:number,date:number}} queue
   */
  getQueueToSave= (isReset = false) => {
    const seconds = getTodaySeconds();
    if (isReset) {
      this.queue = this.queue.filter((qWord) => !qWord.isAgain);
      this.queue = this.queue.map((qWord) => {
        const newQWord = { ...qWord };
        delete newQWord.isDone;
        return newQWord;
      });
    }
    return {
      queue: this.queue.map((qWord) => {
        const saveWord = { w: qWord.word.definition.word, isEd: qWord.isEducation };
        if (qWord.isAgain) {
          saveWord.isA = qWord.isAgain;
        }
        if (qWord.isDone) {
          saveWord.isD = qWord.isDone;
        }
        return saveWord;
      }),
      date: seconds,
      hasUpdate: this.needAnUpdate,
      queueType: this.queueType,
    };
  };

  /**
   * @param {boolean} isAnswered
   */
  updateStatistics = async (isAnswered) => {
    const { word, isEducation } = this.getCurrentWord();
    const isLast = this.queue.filter(({ word: w }) => word === w).every(({ isDone }) => isDone === true);
    const wasNew = word.wasNewToday() && this.queue.filter(({ word: w }) => word === w)
      .reduce((count, { isDone }) => (isDone ? count + 1 : count), 0) === 1;
    return statisticsController.updateAll(isEducation, isAnswered, wasNew, isLast, this.getQueueToSave());
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
    this.needAnUpdate = false;
    this.subQueue = null;
    this.setQueueType();
    await statisticsController.resetQueue(this.getQueueToSave(true));
    wordQueueSubject.notify(this);
  }

  getWords= () => this.words;
}
