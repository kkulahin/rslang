import Subject from './Subject';

class NotificationSubject extends Subject {
  notify = (title, message) => {
    this.observers.forEach((observer) => { observer({ title, message }); });
  }
}

const notificationSubject = new NotificationSubject();

export default notificationSubject;
