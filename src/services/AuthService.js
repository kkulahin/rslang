import { SchoolURL, cookieLifeCyrcle } from '../config/default';
import responseFromServer from '../utils/responseFromServer';
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';
import signinSubject from '../utils/observers/SignInSubject';

class AuthService {
  isLoggedIn = () => {
    const login = getCookie('login');
    const auth = getCookie('auth');
    return { auth: auth !== null && auth !== '', login: login !== null && login !== '' };
  }

  tryLogIn = async () => {
    const authStr = getCookie('auth');
    if (authStr === null && authStr !== '') {
      const userLogged = await this.tryToUseLocalStorage();
      if (!userLogged) {
        deleteCookie('login');
      }
      signinSubject.notify(userLogged);
    }
    try {
      const auth = JSON.parse(authStr);
      const tokenWorks = await this.checkTokenWorks(auth);
      if (tokenWorks) {
        signinSubject.notify(tokenWorks);
      }
      const userLogged = await this.tryToUseLocalStorage();
      if (!userLogged) {
        deleteCookie('login');
      }
      signinSubject.notify(userLogged);
    } catch (e) {
      deleteCookie('login');
      signinSubject.notify(false);
    }
  }

  /**
   * @param {Object} userData
   * @param {string} userData.email
   * @param {string} userData.password
   */
  getNewToken = async (userData) => {
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
  checkTokenWorks = async (auth) => {
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

  tryToUseLocalStorage = async () => {
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

const authService = new AuthService();

export default authService;
