import Word from './Word';
import Difficulty from './Difficulty';
import IntervalPhase from './IntervalPhase';
import WordDefinition from './WordDefinition';

export default class WordController {
  /**
   * Class to create a queue of the words
   * @param {[{}]} newWords array of flat words
   * @param {[{}]} userWords array of flat words
   */
  constructor(newWords, userWords) {
    this.words = [];
    this.queue = [];
    newWords.forEach((word) => this.words.push(new Word(new WordDefinition(word)), {}));
    userWords.forEach((word) => this.words.push(new Word(new WordDefinition(word)), word));
    this.makeQueue();
  }

  makeQueue = () => {
    // TODO
  }
}
