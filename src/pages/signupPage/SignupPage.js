/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Grid, Image,
} from 'semantic-ui-react';
import VectorMan from '../../assets/image/vector_man.png';
import URL from '../../default';
import responseFromServer from '../../utils/responseFromServer';

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

const userData = {
  email: '',
  password: '',
};

const SignUpForm = () => {
  const [isChecked, setValidate] = useState(errorState);
  const [isDisabled, setButtonBehaviour] = useState(true);
  const [data, setUserData] = useState(userData);

  const isEmptyField = (field) => field.length === 0;
  const isValidatePattern = (field, pattern) => {
    const re = new RegExp(pattern);
    return !re.test(field);
  };

  useEffect(() => {
    let errors = true;
    Object.keys(isChecked).forEach((field) => {
      if (isChecked[field].isChanged && !isChecked[field].isRequired && !isChecked[field].error) {
        errors = false;
      } else {
        errors = true;
      }
    });
    // eslint-disable-next-line no-unused-expressions
    errors === true ? setButtonBehaviour(true) : setButtonBehaviour(false);
  }, [isChecked]);

  const validateEmail = (e) => {
    const { email } = isChecked;

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
    const { password } = isChecked;
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
    const { email } = isChecked;
    if (email.isRequired) {
      return requiredFieldError;
    }
    if (!email.isRequired && email.error) {
      return emailError;
    }
    return null;
  };

  const sendErrorPassword = () => {
    const { password } = isChecked;
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
        const response = await responseFromServer(`${URL}/users`, 'POST', data);
        console.log(response);
      } catch (error) {
        throw new Error('invalid request');
      }
    };
    createUser();
  };

  return (
    <Grid className="register-wrapper">
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
            error={isChecked.email.isChanged ? sendErrorEmail() : null}
            fluid
            autoComplete="off"
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            onChange={validateEmail}
          />
          <Form.Input
            error={isChecked.email.isChanged ? sendErrorPassword() : null}
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
