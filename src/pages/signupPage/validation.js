const patternValidate = {
  email: '^[A-Za-z-]{1,}[a-z0-9]*@[A-Za-z]{1,}\\.{1,}[a-z]{2,}$',
  password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d@#$^!%*?&]{8,}$',
  nickname: '[a-zA-Z0-9]{3,}',
};

const emailError = {
  content: 'Please enter valid email',
  pointing: 'below',
};

const passwordError = {
  content: 'Password should contain one: special symbol, number, capital letter and lowercase letter.',
  pointing: 'below',
};

const passwordErrorMaxLength = {
  content: 'Please enter valid password. Password should equal or more 8 symbols',
  pointing: 'below',
  maxLength: 8,
};

const requiredFieldError = {
  content: "It's field required",
  pointing: 'below',
};

const nicknameError = {
  content: 'Please enter valid nickname. Nickname should more than 3 symbols',
  pointing: 'below',
};

export {
  patternValidate, emailError, passwordError, requiredFieldError, nicknameError, passwordErrorMaxLength,
};
