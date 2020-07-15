import Subject from './Subject';

class WordsReloadedSubject extends Subject {
  notify = (updated) => {
    this.observers.forEach((observer) => { observer(updated); });
  }
}

const wordsReloadedSubject = new WordsReloadedSubject();

export default wordsReloadedSubject;
