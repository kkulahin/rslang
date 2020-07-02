import WordModel from './WordModel';
import signinSubject from '../observers/SignInSubject';

class WordController {
  constructor() {
    this.model = new WordModel({ MAX_WORDS: 10, MAX_NEW_WORDS: 3 });
    this.isInitialized = false;
    signinSubject.subscribe(this.init);
  }

  init = async () => {
    if (!this.isInitialized) {
      this.isInitialized = true;
      await this.model.init();
    }
  }

  updateStatistics = async () => this.model.updateStatistics();

  updateWord = async (word) => this.model.updateWord(word);

  getQueue = () => this.model.wordQueue;

  endQueue = async () => this.endQueue();
}

const wordController = new WordController();
export default wordController;
