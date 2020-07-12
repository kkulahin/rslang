import Subject from './Subject';

class SignInSubject extends Subject {
  notify = (isLogged) => {
    this.observers.forEach((observer) => { observer(isLogged); });
  }
}

const signinSubject = new SignInSubject();

export default signinSubject;
