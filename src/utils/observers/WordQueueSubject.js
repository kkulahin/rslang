import Subject from './Subject';

class WordQueueSubject extends Subject {
  notify = (wordQueue) => {
    this.observers.forEach((observer) => { observer(wordQueue); });
  }
}

const wordQueueSubject = new WordQueueSubject();

export default wordQueueSubject;
