import WordModel from './WordModel';

export default class WordController {
  constructor() {
    this.model = new WordModel({});
  }

  init = async () => {
    return this.model.init();
  }

  updateStatistics = async () => {
    return this.model.updateStatistics();
  }

  updateWord = async (word) => {
    return this.model.updateWord(word);
  }

  endQueue = async () => {
    return this.endQueue();
  }
}
