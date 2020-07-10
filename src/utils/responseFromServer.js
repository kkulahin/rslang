import { SchoolURL, cookieLifeCyrcle } from '../config/default';
import { getCookie, setCookie, deleteCookie } from './cookie';
import signinSubject from './observers/SignInSubject';

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

export class AuthService {
  static isLoggedIn = () => {
    const login = getCookie('login');
    const auth = getCookie('auth');
    return { auth: auth !== null && auth !== '', login: login !== null && login !== '' };
  }

  static getUser = () => {
    const authStr = getCookie('auth');
    if (authStr === null || authStr === '') {
      return null;
    }
    return JSON.parse(authStr);
  }

  static tryLogIn = async () => {
    const auth = this.getUser();
    if (auth === null) {
      const userLogged = await this.tryToUseLocalStorage();
      if (!userLogged) {
        deleteCookie('login');
        return false;
      }
      signinSubject.notify(userLogged);
    }
    try {
      const tokenWorks = await this.checkTokenWorks(auth);
      if (tokenWorks) {
        signinSubject.notify(tokenWorks);
        return true;
      }
      const userLogged = await this.tryToUseLocalStorage();
      if (!userLogged) {
        deleteCookie('login');
        return false;
      }
      signinSubject.notify(userLogged);
      return true;
    } catch (e) {
      deleteCookie('login');
      signinSubject.notify(false);
      return false;
    }
  }

  /**
   * @param {Object} userData
   * @param {string} userData.email
   * @param {string} userData.password
   */
  static getNewToken = async (userData) => {
    const getUserNotification = {
      msg: 'Token was gotten successfully',
      status: true,
    };
    try {
      const response = await responseFromServer(`${SchoolURL}/signin`, null, getUserNotification, 'POST', userData);
      if (response.notification.status) {
        setCookie('auth', JSON.stringify(response.data), cookieLifeCyrcle);
      }
      return response.data;
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {Object} auth
   * @param {string} auth.token
   * @param {string} auth.userId
   */
  static checkTokenWorks = async (auth) => {
    const getUserNotification = {
      msg: 'Token was verified',
      status: true,
    };
    try {
      const response = await responseFromServer(`${SchoolURL}/users/${auth.userId}`, auth.token, getUserNotification, 'GET');
      return response.notification.status;
    } catch (e) {
      return false;
    }
  }

  static tryToUseLocalStorage = async () => {
    const userDataStr = getCookie('login');
    if (userDataStr === null || userDataStr === '') {
      return false;
    }
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.email && userData.password) {
        const newAuth = await this.getNewToken(userData);
        if (!newAuth) {
          return false;
        }
        const tokenWorks = await this.checkTokenWorks(newAuth);
        return tokenWorks;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}

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
  let user = AuthService.getUser();
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
        const isLoggedIn = await AuthService.tryLogIn();
        console.log(isLoggedIn);
        if (!isLoggedIn) {
          deleteCookie('login');
          signinSubject.notify(false);
          return { response: { ok: false, statusText: 'Unauthorized', status: 401 } };
        }
        user = AuthService.getUser();
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
