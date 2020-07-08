import Subject from './Subject';

class WordUpgradeSubject extends Subject {
  notify = (doReplace) => {
    this.observers.forEach((observer) => { observer(doReplace); });
  }
}

const wordUpgradeSubject = new WordUpgradeSubject();

export default wordUpgradeSubject;
