import Word from './Word';
import WordDefinition from './WordDefinition';

export default class WordController {
  constructor() {
    /** @type {[Word]} */
    this.words = [];
    this.queue = [];
    this.repeatCount = 0;
    this.queueLength = 0;
  }

  static MAX_NEW_WORDS = 20;

  static MAX_WORDS = 40;

  static queueSort = (queueWord1, queueWord2) => queueWord1.nextTime - queueWord2.nextTime;

  /**
   * create a new queue of the words
   * @param {[{}]} words array of flat words ( new or already prepared for this day)
   * @param {[{}]} userWords array of flat words (if not specified words will be treted as today words)
   */
  makeQueue = (newWords, userWords) => {
    newWords.forEach((word) => this.words.push(new Word(new WordDefinition(word), {})));
    const pontentialWords = [];
    const potentialQueue = [];
    userWords.forEach((word) => pontentialWords.push(new Word(new WordDefinition(word), word)));
    WordController.fillQueue(pontentialWords, potentialQueue);
    WordController.fillQueue(this.words, this.queue);
    this.filterUserWordsByCount(potentialQueue);
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
      const { queueWord } = words.filter((word) => qWord.id === word.wordId);
      this.queue.push({ word: new Word(new WordDefinition(queueWord), queueWord), isEducation: qWord.isEd });
    });
  };

  static fillQueue = (words, queue) => {
    words.forEach((word) => WordController.addToQueueIfNeeded(word, queue));
  }

  filterUserWordsByCount = (potentialQueue) => {
    const maxCount = WordController.MAX_WORDS - WordController.MAX_NEW_WORDS;
    const userWords = [];
    potentialQueue.sort(WordController.queueSort);
    potentialQueue.forEach((queueWord) => {
      if (!userWords.includes(queueWord.word)) {
        userWords.push(queueWord.word);
      }
    });
    userWords.length = maxCount;
    const queueToAdd = potentialQueue.filter((queueWord) => userWords.includes(queueWord.word));
    this.queue.push(...queueToAdd);
    this.words.push(...userWords);
    this.queue.sort(WordController.queueSort);
  }

  getNextWord = () => this.queue[0];

  setWordMistaken = () => {
    const qWord = this.queue[0];
    qWord.word.isAgain = true;
    qWord.word.setMistake();
    this.changeWord();
  }

  setWordAnswered = () => this.changeWord();

  changeWord = () => {
    this.queue[0].word.setTime();
    this.queue.shift();
  }

  static addToQueueIfNeeded = (word, queue) => {
    const educationTimes = word.getNextEducationTimes();
    const repetitionTime = word.getRepetitionTime();
    if (repetitionTime) {
      queue.push({ word, isEducation: false, nextTime: repetitionTime });
    }
    educationTimes.forEach((time) => queue.push({ word, isEducation: true, nextTime: time }));
  }

  getTodayWords = () => this.words.map((word) => word.definition.wordId);

  getLength= () => this.queueLength;

  getCurrentLength = () => this.queue.getCurrentLength();

  getQueueToSave= () => ({
    queue: this.queue.map((qWord) => ({ id: qWord.word.definition.wordId, isEd: qWord.isEducation })),
    length: this.queueLength,
  });

  getWordsToSave= () => this.words;
}
