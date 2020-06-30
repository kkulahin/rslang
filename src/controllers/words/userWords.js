import { SchoolURL } from '../../config/default';
import responseFromServer from '../../utils/responseFromServer';

const wordsNotification = {
  msg: '',
  status: true,
};

const UserWordFailMsg = {
  msg: '',
  status: true,
};

const getAllUserWords = async (token, id, notification = wordsNotification) => {
  try {
    if (token === null) {
      return false;
    }
    const response = await responseFromServer(`${SchoolURL}/users/${id}/words`, token, notification);
    return response;
  } catch (error) {
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
    const failResponse = {
      data: null,
      notification: UserWordFailMsg,
    };
    return failResponse;
  }
};

export { getAllUserWords, getUserWordById, createUserWordById };
