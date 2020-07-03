import { SchoolURL } from '../config/default';
import authService from '../services/AuthService';
import history from './history';
import signinSubject from './observers/SignInSubject';
import { deleteCookie } from './cookie';

const responseFromServer = async (url,
  token = null,
  notification = { msg: '', status: null },
  method = 'GET', userData = null) => {
  let setNotification = notification;
  let headers = {
    Accept: 'application/json',
  };
  if (token !== null) {
    headers = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
  }
  if (method !== 'GET') {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
  }

  let params = {
    method,
    withCredentials: token !== null,
    headers,
  };

  if (method !== 'GET') {
    params = {
      ...params,
      body: JSON.stringify(userData),
    };
  }
  const response = await fetch(url, params);

  if (!response.ok) {
    setNotification = { msg: `${response.statusText}: ${response.status}`, status: false };
  }

  const data = await response.json();
  return { data, notification: setNotification };
};

const retryMakeRequest = async (method, path, token, body, params = {}) => {
  const url = new URL(`${SchoolURL}/${path}`);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  const request = {
    url,
    options: {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
  if (body) {
    request.options.body = JSON.stringify(body);
  }
  const response = await fetch(request.url, request.options);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Retry');
    }
  }
  const data = await response.json();
  return { data, response };
};

export const makeRequest = async (method, pathTemplate, body, params = {}) => {
  const tryTimes = 2;
  let index = 0;
  let isAuthError = false;
  let path = pathTemplate;
  let response = {};
  let user = authService.getUser();
  if (user === null) {
    isAuthError = true;
  } else {
    path = pathTemplate.replace('%%userId%%', user.userId);
  }

  while (index < tryTimes) {
    try {
      if (isAuthError) {
        isAuthError = false;
        // eslint-disable-next-line no-await-in-loop
        const isLoggedIn = await authService.tryLogIn();
        if (!isLoggedIn) {
          deleteCookie('login');
          signinSubject.notify(false);
          return { response: { ok: false, statusText: 'Unauthorized', status: 401 } };
        }
        user = authService.getUser();
        if (user) {
          path = pathTemplate.replace('%%userId%%', user.userId);
        }
      }

      // eslint-disable-next-line no-await-in-loop
      response = await retryMakeRequest(method, path, user.token, body, params);
      return response;
    } catch (e) {
      if (e.message === 'Retry') {
        isAuthError = true;
      }
      index += 1;
    }
  }
  return response;
};

export default responseFromServer;
