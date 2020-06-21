import Word from './Word';
import WordDefinition from './WordDefinition';

export default class WordController {
  /**
   * Class to create a queue of the words
   * @param {[{}]} words array of flat words ( new or already prepared for this day)
   * @param {[{}]} userWords array of flat words (if not specified words will be treted as today words)
   */
  constructor(words, userWords) {
    /** @type {[Word]} */
    this.words = [];
    this.queue = [];
    if (userWords) {
      this.makeQueue(words, userWords);
    } else {
      words.forEach((word) => this.words.push(new Word(new WordDefinition(word)), word));
      WordController.fillQueue(this.words, this.queue);
      this.queue.sort(WordController.queueSort);
    }
  }

  static MAX_NEW_WORDS = 20;

  static MAX_WORDS = 40;

  static queueSort = (queueWord1, queueWord2) => queueWord1.nextTime - queueWord2.nextTime;

  makeQueue = (newWords, userWords) => {
    newWords.forEach((word) => this.words.push(new Word(new WordDefinition(word)), {}));
    const pontentialWords = [];
    const potentialQueue = [];
    userWords.forEach((word) => pontentialWords.push(new Word(new WordDefinition(word)), word));
    WordController.fillQueue(pontentialWords, potentialQueue);
    WordController.fillQueue(this.words, this.queue);
    this.filterUserWordsByCount(potentialQueue);
  }

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
    const educationTime = word.getNextEducationTime();
    const repetitionTime = word.getRepetitionTime();
    if (repetitionTime) {
      queue.push({ word, isEducation: false, nextTime: repetitionTime });
    }
    if (educationTime) {
      queue.push({ word, isEducation: true, nextTime: educationTime });
    }
  }

  getTodayWords = () => this.words.map((word) => word.definition.wordId);
}
