import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Form, Grid, Image,
} from 'semantic-ui-react';
import VectorMan from '../../assets/image/vector_man.png';
import { createUser } from '../../controllers/users/users';

import {
  patternValidate, emailError, passwordError, requiredFieldError, nicknameError, passwordErrorMaxLength,
} from './validation';

import './SignupPage.scss';

const errorState = {
  email: {
    error: false,
    isRequired: false,
    isChanged: false,
  },
  password: {
    error: false,
    maxLength: false,
    isRequired: false,
    isChanged: false,
  },
  nickname: {
    error: false,
    isRequired: false,
    isChanged: false,
  },
};

const userData = {
  email: '',
  password: '',
  nickname: '',
};

const notification = {
  msg: '',
  status: null,
};

const SignUpForm = () => {
  const [isValid, setValidate] = useState(errorState);
  const [isDisabled, setButtonBehaviour] = useState(true);
  const [data, setUserData] = useState(userData);
  const [userNotification, setUserNotification] = useState(notification);
  const [redirectToLogin, setRedirect] = useState(false);

  const isEmptyField = (field) => field.length === 0;
  const isValidatePattern = (field, pattern) => {
    const re = new RegExp(pattern);
    return !re.test(field);
  };

  useEffect(() => {
    let errors = true;
    const errKeys = Object.keys(isValid);
    for (let err = 0; err < errKeys.length; err += 1) {
      if (isValid[errKeys[err]].isChanged && !isValid[errKeys[err]].isRequired && !isValid[errKeys[err]].error) {
        errors = false;
        if (errKeys[err] === 'password' && isValid[errKeys[err]].maxLength) {
          errors = true;
          break;
        }
      } else {
        errors = true;
        break;
      }
    }
    // eslint-disable-next-line no-unused-expressions
    errors === true ? setButtonBehaviour(true) : setButtonBehaviour(false);
  }, [isValid]);

  const validateEmail = (e) => {
    const { email } = isValid;

    if (!email.isChanged) {
      email.isChanged = true;
      const newErrorState = {
        ...errorState,
        email,
      };
      setValidate(newErrorState);
    }
    if (email.isChanged) {
      email.isRequired = isEmptyField(e.target.value);
      email.error = isValidatePattern(e.target.value, patternValidate.email);
      const newErrorState = {
        ...errorState,
        email,
      };
      const newUserData = {
        ...data,
        email: e.target.value,
      };
      setUserData(newUserData);
      setValidate(newErrorState);
    }
  };

  const validatePassword = (e) => {
    const { password } = isValid;
    if (!password.isChanged) {
      password.isChanged = true;
      const newErrorState = {
        ...errorState,
        password,
      };
      setValidate(newErrorState);
    }
    if (password.isChanged) {
      password.isRequired = isEmptyField(e.target.value);
      password.error = isValidatePattern(e.target.value, patternValidate.password);
      password.maxLength = !(e.target.value.length >= passwordErrorMaxLength.maxLength);
      const newErrorState = {
        ...errorState,
        password,
      };
      const newUserData = {
        ...data,
        password: e.target.value,
      };
      setUserData(newUserData);
      setValidate(newErrorState);
    }
  };

  const validateNickname = (e) => {
    const { nickname } = isValid;
    if (!nickname.isChanged) {
      nickname.isChanged = true;
      const newErrorState = {
        ...errorState,
        nickname,
      };
      setValidate(newErrorState);
    }
    if (nickname.isChanged) {
      nickname.isRequired = isEmptyField(e.target.value);
      nickname.error = isValidatePattern(e.target.value, patternValidate.nickname);
      const newErrorState = {
        ...errorState,
        nickname,
      };
      const newUserData = {
        ...data,
        nickname: e.target.value,
      };
      setUserData(newUserData);
      setValidate(newErrorState);
    }
  };

  const sendErrorEmail = () => {
    const { email } = isValid;
    if (email.isRequired) {
      return requiredFieldError;
    }
    if (!email.isRequired && email.error) {
      return emailError;
    }
    return null;
  };

  const sendErrorPassword = () => {
    const { password } = isValid;
    if (password.isRequired) {
      return requiredFieldError;
    }
    if (!password.isRequired && password.maxLength) {
      return passwordErrorMaxLength;
    }
    if (!password.isRequired && password.error) {
      return passwordError;
    }
    return null;
  };

  const sendErrorNickName = () => {
    const { nickname } = isValid;
    if (nickname.isRequired) {
      return requiredFieldError;
    }
    if (!nickname.isRequired && nickname.error) {
      return nicknameError;
    }
    return null;
  };

  const onSubmit = () => {
    const submitUser = async () => {
      try {
        const userMsg = {
          msg: 'User created successfully. You will be redirected',
          status: true,
        };
        const userServerData = {
          name: data.nickname,
          email: data.email,
          password: data.password,
        };
        const response = await createUser(userServerData, userMsg);
        setUserNotification(response.notification);
        if (response.notification.status) {
          setTimeout(() => setRedirect(true), 3000);
        }
      } catch (error) {
        throw new Error('invalid request');
      }
    };
    submitUser();
  };

  return (
    <Grid className="register-wrapper">
      {redirectToLogin ? <Redirect to="/signin" /> : null}
      { userNotification.status !== null ? (
        <div className={userNotification.status ? 'user-notification success' : 'user-notification error'}>
          {' '}
          {userNotification?.msg}
        </div>
      ) : null}
      <Grid.Column className="register-column">
        <div className="register-header">
          <Image src={VectorMan} />
          RS Lang
        </div>
        <Form method="POST" onSubmit={onSubmit} className="register-form large">
          <div className="form-header">
            <h2 className="header">Register account</h2>
            <div className="description">
              To sign-up for a free basic
              account please provide us with some baseic imformation using the contact form below.
              Please use valid credential
            </div>
          </div>
          <Form.Input
            error={isValid.nickname.isChanged ? sendErrorNickName() : null}
            fluid
            autoComplete="off"
            icon="user"
            iconPosition="left"
            placeholder="Nickname"
            onChange={validateNickname}
          />
          <Form.Input
            error={isValid.email.isChanged ? sendErrorEmail() : null}
            fluid
            autoComplete="off"
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            onChange={validateEmail}
          />
          <Form.Input
            error={isValid.password.isChanged ? sendErrorPassword() : null}
            fluid
            required
            autoComplete="off"
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
            onChange={validatePassword}
          />
          <Button className="register" disabled={isDisabled}>
            Register
          </Button>
        </Form>

      </Grid.Column>
    </Grid>
  );
};

export default SignUpForm;
