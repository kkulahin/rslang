/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Form, Grid, Image,
} from 'semantic-ui-react';
import VectorMan from '../../assets/image/vector_man.png';
import { SchoolURL } from '../../config/default';
import responseFromServer from '../../utils/responseFromServer';
import {
  patternValidate, emailError, passwordError, requiredFieldError,
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
    isRequired: false,
    isChanged: false,
  },
};

const userData = {
  email: '',
  password: '',
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
    Object.keys(isValid).forEach((field) => {
      if (isValid[field].isChanged && !isValid[field].isRequired && !isValid[field].error) {
        errors = false;
      } else {
        errors = true;
      }
    });
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
    if (!password.isRequired && password.error) {
      return passwordError;
    }
    return null;
  };

  const onSubmit = () => {
    const createUser = async () => {
      try {
        const userMsg = {
          msg: 'User created successfully. You will be redirected',
          status: true,
        };
        const response = await responseFromServer(`${SchoolURL}/users`, userMsg, 'POST', data);
        setUserNotification(response.notification);
        if (response.notification.status) {
          setTimeout(() => setRedirect(true), 3000);
        }
      } catch (error) {
        throw new Error('invalid request');
      }
    };
    createUser();
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
            error={isValid.email.isChanged ? sendErrorEmail() : null}
            fluid
            autoComplete="off"
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            onChange={validateEmail}
          />
          <Form.Input
            error={isValid.email.isChanged ? sendErrorPassword() : null}
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
