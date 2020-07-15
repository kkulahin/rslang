import Subject from './Subject';

class ConfirmSubject extends Subject {
  notify = (title, message) => {
    this.observers.forEach((observer) => { observer({ title, message }); });
  }
}

const confirmSubject = new ConfirmSubject();

export default confirmSubject;
