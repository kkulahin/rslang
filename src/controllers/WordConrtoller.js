import WordModel from '../models/WordModel';
import settingsController from './SettingsController';
import statisticsController from './StatisticsController';

class WordController {
  constructor() {
    this.model = new WordModel();
  }

  init = async () => {
    if (!this.isInitialized) {
      this.isInitialized = true;
      await settingsController.getAsync();
      await statisticsController.getAsync();
      await this.model.init();
    }
  }

  updateStatistics = async () => this.model.updateStatistics();

  updateWord = async (word, isNew) => this.model.updateWord(word, isNew);

  getUserWords = async (words) => this.model.getWordsFromSavedQueue(words);

  getQueue = () => this.model.wordQueue;

  getWordsCount = () => {
    if (!this.model.wordQueue) {
      return null;
    }
    return this.model.wordQueue.getWordsCount();
  }

  makeQueue = async () => this.model.makeQueue();

  reset = () => {
    this.isInitialized = false;
    this.model.reset();
  }
}

const wordController = new WordController();
export default wordController;
