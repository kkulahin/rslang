import WordModel from './WordModel';

export default class WordController {
  constructor() {
    this.model = new WordModel({MAX_WORDS: 10, MAX_NEW_WORDS: 3});
  }

  init = async () => this.model.init();

  updateStatistics = async () => this.model.updateStatistics();

  updateWord = async (word) => this.model.updateWord(word);

  endQueue = async () => this.endQueue();
}
