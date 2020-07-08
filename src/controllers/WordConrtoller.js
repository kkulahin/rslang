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

  getQueue = () => this.model.wordQueue;

  endQueue = async () => this.endQueue();

  reset = () => {
    this.isInitialized = false;
    this.model.reset();
  }
}

const wordController = new WordController();
export default wordController;
