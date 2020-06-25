import Word from './Word';
import WordDefinition from './WordDefinition';

export default class WordQueue {
  constructor({ settings }) {
    /** @type {[Word]} */
    this.words = [];
    this.queue = [];
    this.repeatCount = 0;
    this.queueLength = 0;
    this.settings = settings;
  }

  static queueSort = (queueWord1, queueWord2) => queueWord1.nextTime - queueWord2.nextTime;

  /**
   * create a new queue of the words
   * @param {[{}]} words array of flat words ( new or already prepared for this day)
   * @param {[{}]} userWords array of flat words (if not specified words will be treted as today words)
   */
  makeQueue = (newWords, userWords) => {
    if (newWords.length > this.settings.MAX_NEW_WORDS) {
      newWords.splice(this.settings.MAX_NEW_WORDS, newWords.length - this.settings.MAX_NEW_WORDS);
    }
    newWords.forEach((word) => this.words.push(new Word(new WordDefinition(word), {})));
    const pontentialWords = [];
    const potentialQueue = [];
    userWords.forEach((word) => {
      const wordConfigs = word.userWord && word.userWord.optional ? word.userWord.optional : {};
      pontentialWords.push(new Word(new WordDefinition(word), wordConfigs));
    });
    WordQueue.fillQueue(pontentialWords, potentialQueue);
    WordQueue.fillQueue(this.words, this.queue);
    this.filterUserWordsByCount(potentialQueue);
    this.words.forEach((w) => w.shiftMistakes());
    this.queueLength = this.queue.length;
  }

  /**
   * create a new queue of the words
   * @param {Object} queueSettings queue settings
   * @param {[number]} queueSettings.queue array of word ids
   * @param {number} queueSettings.length queue length
   * @param {[{}]} words array of flat words ( new or already prepared for this day)
   */
  usePredefinedQueue = (queueSettings, words) => {
    this.words = words;
    this.queueLength = queueSettings.length;
    queueSettings.queue.forEach((qWord) => {
      const [queueWord] = words.filter((word) => qWord.w === word.word);
      const wordConfigs = queueWord.userWord && queueWord.userWord.optional ? queueWord.userWord.optional : {};
      this.queue.push({ word: new Word(new WordDefinition(queueWord), wordConfigs), isEducation: qWord.isEd });
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
    const maxCount = this.settings.MAX_WORDS - this.settings.MAX_NEW_WORDS;
    const userWords = [];
    potentialQueue.sort(WordQueue.queueSort);
    potentialQueue.forEach((queueWord) => {
      if (!userWords.includes(queueWord.word)) {
        userWords.push(queueWord.word);
      }
    });
    userWords.length = maxCount;
    const queueToAdd = potentialQueue.filter((queueWord) => userWords.includes(queueWord.word));
    this.queue.push(...queueToAdd);
    this.words.push(...userWords);
    this.queue.sort(WordQueue.queueSort);
  }

  getCurrentWord = () => this.queue[0];

  setWordMistaken = () => {
    const qWord = this.queue[0];
    this.queue.push(qWord);
    qWord.word.setMistake();
    this.changeWord();
    this.queueLength += 1;
  }

  setWordAnswered = () => this.changeWord();

  changeWord = () => {
    this.queue[0].word.setTime();
    this.queue.shift();
    return this.queue[0];
  }

  static addToQueueIfNeeded = (word, queue) => {
    const educationTimes = word.getNextEducationTime();
    const repetitionTime = word.getNextRepetitionTime();
    if (repetitionTime) {
      queue.push({ word, isEducation: false, nextTime: repetitionTime });
    }
    educationTimes.forEach((time) => queue.push({ word, isEducation: true, nextTime: time }));
  }

  getTodayWords = () => this.words.map((word) => word.definition.wordId);

  getLength = () => this.queueLength;

  getCurrentLength = () => this.queue.length;

  /**
   * @returns {{queue:[{w:string,isEd:boolean}],length:number,date:number}} queue
   */
  getQueueToSave= () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      queue: this.queue.map((qWord) => ({ w: qWord.word.definition.word, isEd: qWord.isEducation })),
      length: this.queueLength,
      date: Math.ceil(today.getTime() / 1000),
    };
  };

  getWordsToSave= () => this.words;
}
