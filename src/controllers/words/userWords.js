import { SchoolURL } from '../../config/default';
import responseFromServer, { makeRequest } from '../../utils/responseFromServer';
import notificationSubject from '../../utils/observers/NotificationSubject';

const wordsNotification = {
  msg: '',
  status: true,
};

const UserWordFailMsg = {
  msg: '',
  status: true,
};

const getAllUserWords = async () => {
  try {
    const response = await makeRequest('GET', 'users/%%userId%%/words');
    return response;
  } catch (error) {
    notificationSubject.notify('Cannot get all words', error.massage);
    throw new Error('invalid request');
  }
};

const getUserWordById = async (token, id, wordsId, notification = wordsNotification) => {
  try {
    if (token === null) {
      return false;
    }
    const response = await responseFromServer(`${SchoolURL}/users/${id}/words/${wordsId}`, token, notification);
    return response;
  } catch (error) {
    notificationSubject.notify('Cannot get words by id', error.massage);
    throw new Error('invalid request');
  }
};

const createUserWordById = async (token, id, wordsId, data, notification = wordsNotification) => {
  try {
    if (token === null) {
      return false;
    }
    const response = await responseFromServer(`${SchoolURL}/users/${id}/words/${wordsId}`,
      token,
      notification, 'POST', data, token);
    return response;
  } catch (error) {
    notificationSubject.notify('Cannot get word by id', error.massage);
    const failResponse = {
      data: null,
      notification: UserWordFailMsg,
    };
    return failResponse;
  }
};

export { getAllUserWords, getUserWordById, createUserWordById };
