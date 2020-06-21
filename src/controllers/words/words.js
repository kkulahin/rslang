import SchoolURL from '../../default';
import responseFromServer from '../../utils/responseFromServer';

const wordsNotification = {
  msg: '',
  status: true,
};

const getWords = async (group, page, wordsPerPage = 10, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(
      `${SchoolURL}/words?page=${page}&group=${group}&wordsPerPage=${wordsPerPage}`, null, notification,
    );
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

const getWordsCount = async (group = 0, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/words?group=${group}/count`, null, notification);
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

const getWordsById = async (id, page, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/words/${id}`, null, notification);
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

export { getWords, getWordsCount, getWordsById };
