import Subject from './Subject';

class SettingWordCountSubject extends Subject {
  notify = (settings) => {
    this.observers.forEach((observer) => { observer(settings); });
  }
}

const settingWordCountSubject = new SettingWordCountSubject();

export default settingWordCountSubject;
