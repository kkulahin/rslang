import Subject from './Subject';

class WordCanUpgradeSubject extends Subject {
  notify = (newDifficulty) => {
    this.observers.forEach((observer) => { observer(newDifficulty); });
  }
}

const wordCanUpgradeSubject = new WordCanUpgradeSubject();

export default wordCanUpgradeSubject;
