import Subject from './Subject';

class SignInSubject extends Subject {
  notify = (isLogged) => {
    console.log(this.observers, isLogged);
    this.observers.forEach((observer) => { observer(isLogged); });
  }
}

const signinSubject = new SignInSubject();

export default signinSubject;
