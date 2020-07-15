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
import wordsReloadedSubject from '../observers/WordsReloadedSubject';
import confirmResponseSubject from '../observers/ConfirmResponseSubject';
import confirmSubject from '../observers/ConfirmSubject';

export default class WordQueue {
  constructor() {
    /** @type {[Word]} */
    this.words = [];
    /** @type {[{word:Word, isAgain: boolean, isEducation: boolean, isDone: boolean}]} */
    this.queue = [];
    this.queuePointer = 0;
    this.needAnUpdate = false;
    this.subQueue = null;
    this.previousWordIndex = null;
    this.setQueueType();
    settingsWordCountSubject.subscribe(this.confirmReset);
    confirmResponseSubject.subscribe(this.continueConfirmReset);
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
    this.previousWordIndex = queueSettings.prevIndex;
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
    const isQueueStarted = this.queue !== null && this.queue.some(({ isDone }) => isDone === true);
    if (isQueueStarted && !this.needAnUpdate) {
      confirmSubject.notify('Confirm', 'You have started today learning. Do you want to recreate today game?');
    } else {
      this.continueConfirmReset(true);
    }
  }

  continueConfirmReset = (needAnUpdate) => {
    this.needAnUpdate = needAnUpdate;
    const isQueueStarted = this.queue.some(({ isDone }) => isDone === true);
    if (!isQueueStarted || this.needAnUpdate) {
      this.needAnUpdate = true;
      this.words = [];
      this.subQueue = null;
      this.queue = null;
      this.setQueueType();
      wordQueueSubject.notify(this);
      statisticsController.resetToday();
    }
  }

  createSubQueue = (sendEvent = true) => {
    this.queuePointer = this.getFirstUndone(this.queue, this.queue.length);
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

  getUpdatedWords = async () => {
    const { data: words } = await wordController.getUserWords(this.words);
    words.forEach((word) => {
      const [wordInQueue] = this.words.filter(({ definition: { wordId } }) => wordId === word._id);
      if (wordInQueue && word.userWord && word.userWord.optional) {
        wordInQueue.update(word.userWord.optional);
      }
    });
    const queue = this.subQueue !== null ? this.subQueue : this.queue;
    this.queuePointer = this.getFirstUndone(queue, queue.length);
    wordsReloadedSubject.notify(true);
  }

  getQueueFilter = () => {
    if (WordQueue.queueTypes.all === WordQueue.getQueueTypes()[this.queueType]) {
      return () => true;
    }
    if (WordQueue.queueTypes.new === WordQueue.getQueueTypes()[this.queueType]) {
      return (word) => word.wasNewToday();
    }
    return (word) => word.getDifficulty() === parameters.difficultyNames.hard;
  }

  getFirstUndone = (queue, defValue) => {
    const filter = this.getQueueFilter();
    const first = queue.reduce((firstUndone, { isDone, word }, index) => {
      if (!filter(word)) {
        return firstUndone;
      }
      if (firstUndone || isDone || word.isDeleted) {
        return firstUndone;
      }
      return index;
    }, null);
    if (first === null) {
      return defValue;
    }
    return first;
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
    this.updateWord();
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
    this.previousWordIndex = this.queuePointer;
    if (this.hasWordDeleted) {
      this.hasWordDeleted = false;
      wordQueueSubject.notify(this);
    }
    this.queuePointer = this.getFirstUndone(this.queue, this.queue.length);
    this.beforeChange = false;
    return this.getCurrentWord();
  }

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

  hasPreviousWord = () => (this.previousWordIndex !== this.queuePointer && this.previousWordIndex != null);

  getPreviousWord = () => {
    if (this.hasWordDeleted) {
      this.hasWordDeleted = false;
      wordQueueSubject.notify(this);
    }
    if (this.hasPreviousWord()) {
      this.queuePointer = this.previousWordIndex;
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

  getLength = () => this.queue.reduce((count, { word: { isDeleted } }) => (isDeleted ? count : count + 1), 0);

  getCurrentLength = () => this.queue.reduce((count, { isDone, word: { isDeleted } }) => (
    !isDone && !isDeleted ? count + 1 : count), 0);

  getCurrentPosition = () => this.queue.reduce((count, { isDone, word: { isDeleted } }) => (
    isDone && !isDeleted ? count + 1 : count), 0);

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
      prevIndex: this.previousWordIndex,
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
    this.previousWordIndex = null;
    this.setQueueType();
    await statisticsController.resetQueue(this.getQueueToSave(true));
    wordQueueSubject.notify(this);
  }

  getWords= () => this.words;

  getWordsCount = () => this.words.reduce((count, { isDeleted }) => (isDeleted ? count : count + 1), 0);
}
