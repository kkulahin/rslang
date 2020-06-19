const patternValidate = {
  email: '[A-Za-z-]*@[A-Za-z-]*.[a-z]{2,3}',
  password: '^[A-Z]{1}[A-Za-z!@#$%^&**-=]{7,}$',
};

const emailError = {
  content: 'Please enter valid email',
  pointing: 'below',
};

const passwordError = {
  content: 'Please enter valid password. Password should contain 1 special sumbol',
  pointing: 'below',
};

const requiredFieldError = {
  content: "It's field required",
  pointing: 'below',
};

export {
  patternValidate, emailError, passwordError, requiredFieldError,
};
