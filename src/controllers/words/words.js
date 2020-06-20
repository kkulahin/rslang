import SchoolURL from '../../default';
import responseFromServer from '../../utils/responseFromServer';

const wordsNotification = {
  msg: '',
  status: true,
};

const UserWordFailMsg = {
  msg: '',
  status: true,
};

const getAllUserWords = async (id, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/${id}/words`, notification);
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

const getUserWordById = async (id, wordsId, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/${id}/words/${wordsId}`, notification);
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

const createUserWordById = async (id, wordsId, data, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/${id}/words/${wordsId}`, notification, 'POST', data);
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
