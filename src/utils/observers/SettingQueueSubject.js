import Subject from './Subject';

class SettingQueueSubject extends Subject {
  notify = (settings) => {
    this.observers.forEach((observer) => { observer(settings); });
  }
}

const settingQueueSubject = new SettingQueueSubject();

export default settingQueueSubject;
