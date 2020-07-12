/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

import {
  Button, Form, Grid, Image, Checkbox,
} from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';
import { isAuthUser } from '../../controllers/users/users';
import VectorMan from '../../assets/image/vector_man.png';

import { cookieLifeCyrcle } from '../../config/default';

import { setCookie } from '../../utils/cookie';

import './LoginPage.scss';

const errorState = {
  email: {
    isChanged: false,
    isEmpty: false,
    isValid: false,
  },
  password: {
    isChanged: false,
    isEmpty: false,
    isValid: false,
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

const isRememberUserDefault = () => (localStorage.getItem('rememberUser') !== null
  ? JSON.parse(localStorage.getItem('rememberUser')) : false);

const defaultUserData = () => (localStorage.getItem('userData') !== null
  ? JSON.parse(localStorage.getItem('userData')) : userData);

const LoginForm = () => {
  const [isDisabled, setButtonBehaviour] = useState(true);
  const [data, setUserData] = useState(defaultUserData);
  const [userNotification, setUserNotification] = useState(notification);
  const [redirectToHome, setRedirect] = useState(false);
  const [rememberUser, setRememberUser] = useState(isRememberUserDefault());

  useEffect(() => {
    if (data.email === '' || data.password === '') {
      setButtonBehaviour(true);
    } else {
      setButtonBehaviour(false);
    }
  }, [data.email, data.password]);

  useEffect(() => {
    if (rememberUser) {
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [rememberUser, data]);

  const setEmail = (e) => {
    const userEmail = {
      ...data,
      email: e.target.value,
    };
    setUserData(userEmail);
  };

  const setPassword = (e) => {
    const userPassword = {
      ...data,
      password: e.target.value,
    };
    setUserData(userPassword);
  };

  const isChecked = (e) => {
    const { currentTarget } = e;
    const checkBoxValue = !currentTarget.querySelector('input.hidden').checked;
    localStorage.setItem('rememberUser', checkBoxValue);
    setRememberUser(checkBoxValue);
  };

  const onSubmit = () => {
    const getUser = async () => {
      try {
        const getUserNotification = {
          msg: 'User get successfully',
          status: true,
        };
        const response = await isAuthUser(data, getUserNotification);
        setUserNotification(response.notification);
        if (response.notification.status) {
          setCookie('auth', JSON.stringify(response.data), cookieLifeCyrcle);
          setCookie('login', JSON.stringify(data), (10 * 365 * 24 * 60 * 60));
          setRedirect(true);
        }
      } catch (error) {
        const userAuthMsg = {
          msg: 'Incorrect e-mail or password',
          status: false,
        };
        setUserNotification(userAuthMsg);
        throw new Error('invalid request');
      }
    };
    getUser();
  };
  return (
    <Grid className="login-wrapper">
      {redirectToHome ? <Redirect to="/" /> : null}
      { userNotification.status !== null ? (
        <div className={userNotification.status ? 'user-notification success' : 'user-notification error'}>
          {' '}
          {userNotification?.msg}
        </div>
      ) : null}
      <Grid.Column className="login-column">
        <div className="login-header">
          <Image src={VectorMan} />
          RS Lang
        </div>
        <Form method="POST" className="login-form large" onSubmit={onSubmit}>
          <div className="label">
            <span> Log-in to your account</span>
          </div>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            onChange={setEmail}
            defaultValue={data.email}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
            onChange={setPassword}
            defaultValue={data.password}
          />
          <div className="field">
            <div className="checkbox-wrapper">
              <Checkbox
                label="remember me"
                onChange={isChecked}
                defaultChecked={rememberUser}
              />
            </div>
            <div>
              <a href="/forgot">Forgot password?</a>
            </div>
          </div>

          <Button className="login-button" disabled={isDisabled}>
            Sign in
          </Button>
          <div className="field">
            <span className="login-signup">New here?</span>
            <Link to="/signup" className="login-signup"> Sign up</Link>
          </div>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
