import { SchoolURL } from '../../config/default';
import responseFromServer from '../../utils/responseFromServer';

import random from '../../utils/random';

const wordsNotification = {
  msg: '',
  status: true,
};

const defParamsForWords = {
  maxGroup: 6,
  maxPages: 30,
};

const getRandomPage = () => random(0, defParamsForWords.maxPages);

const getRandomGroup = () => random(0, defParamsForWords.maxGroup);

const getWords = async (group = 0,
  page = 0,
  randomPage = false,
  randomGroup = false,
  wordsPerPage = 10,
  notification = wordsNotification) => {
  try {
    const response = await responseFromServer(
      `${SchoolURL}/words?page=${randomPage
        ? getRandomPage() : page}&group=${randomGroup
        ? getRandomGroup() : group}&wordsPerPage=${wordsPerPage}`, null, notification,
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

const getWordsById = async (id, notification = wordsNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/words/${id}`, null, notification);
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

export { getWords, getWordsCount, getWordsById };
