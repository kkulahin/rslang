import Subject from './Subject';

class StatisticsSubject extends Subject {
  notify = (statistics) => {
    this.observers.forEach((observer) => { observer(statistics); });
  }
}

const settingSubject = new StatisticsSubject();

export default settingSubject;
