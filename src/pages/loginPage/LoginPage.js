/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import {
  Button, Form, Grid, Image,
} from 'semantic-ui-react';
import VectorMan from '../../assets/image/vector_man.png';

import './LoginPage.scss';

const LoginForm = () => (
  <Grid className="login-wrapper">
    <Grid.Column className="login-column">
      <div className="login-header">
        <Image src={VectorMan} />
        RS Lang
      </div>
      <Form className="login-form large">
        <div className="label">
          <span> Log-in to your account</span>
        </div>
        <Form.Input fluid icon="user" iconPosition="left" placeholder="E-mail address" />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          type="password"
        />
        <div className="field">
          <div className="checkbox-wrapper">
            <input type="checkbox" id="login-checkbox" name="login-checkbox" />
            <label htmlFor="login-checkbox">
              <span />
              Rememeber me
            </label>
          </div>
          <div>
            <a href="/forgot">Forgot password?</a>
          </div>
        </div>

        <Button className="login-button">
          Sign in
        </Button>
        <div className="field">
          <span className="login-signup">New here?</span>
          <a href="/signup" className="login-signup"> Sign up</a>
        </div>
      </Form>
    </Grid.Column>
  </Grid>
);

export default LoginForm;
