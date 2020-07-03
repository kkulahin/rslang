import Subject from './Subject';

class SettingSubject extends Subject {
  notify = (settings) => {
    this.observers.forEach((observer) => { observer(settings); });
  }
}

const settingSubject = new SettingSubject();

export default settingSubject;
