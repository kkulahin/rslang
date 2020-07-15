import Subject from './Subject';

class ConfirmResponseSubject extends Subject {
  notify = (title, message) => {
    this.observers.forEach((observer) => { observer({ title, message }); });
  }
}

const confirmResponseSubject = new ConfirmResponseSubject();

export default confirmResponseSubject;
