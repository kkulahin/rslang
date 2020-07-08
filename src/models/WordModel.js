import fetch from 'node-fetch';
// import Word from './Word';
import parameters from '../utils/spacedRepetition/parameters';
import WordQueue from '../utils/spacedRepetition/WordQueue';
import { getCookie } from '../utils/cookie';
import wordQueueSubject from '../utils/observers/WordQueueSubject';
import { makeRequest } from '../utils/responseFromServer';
import signinSubject from '../utils/observers/SignInSubject';
import authService from '../services/AuthService';

export default class WordModel {
  /**
  * Model to work with a queue of words
  * @param {Object} settings
  */
  constructor(settings) {
    this.settings = settings;
    signinSubject.subscribe(this.getUser);
  }

  init = async () => {
    this.getUser();
    if (this.user === null) {
      await authService.tryLogIn();
      if (this.user === null) {
        throw Error('Cannot get user. Wait user logged in');
      }
    }
    await this.getStatistics();
    if (!this.hasQueueForToday()) {
      const { data: userWords } = await this.queryUserWords();
      const { data: newWords } = await this.queryNewWords();
      this.wordQueue = new WordQueue(this.settings);
      this.wordQueue.makeQueue(newWords, userWords);
      this.updateStatistics();
    } else {
      this.wordQueue = new WordQueue(this.settings);
      const { data: words } = await this.getWordsFromSavedQueue();
      this.wordQueue.usePredefinedQueue(this.statistics.optional.todayQueue, words);
    }

    wordQueueSubject.notify(this.wordQueue);

    // test
    const words = this.wordQueue.queue.map((queueW) => ({
      word: queueW.word.definition.word,
      phase: queueW.word.repetitionPhase,
      isEducation: queueW.isEducation,
      nextTime: queueW.nextTime,
    }));
  }

  getUser= () => {
    const userStr = getCookie('auth');
    if (userStr === null || userStr === '') {
      this.user = null;
    } else {
      this.user = JSON.parse(userStr);
    }
  }

  hasQueueForToday = () => {
    const { todayQueue } = this.statistics.optional;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySeconds = Math.ceil(today.getTime() / 1000);
    if (todayQueue) {
      if (todayQueue.queue.length === 0) {
        return false;
      }
      if (todayQueue.date === todaySeconds) {
        return true;
      }
      if (todayQueue.date < todaySeconds && todayQueue.length === todayQueue.queue.length) {
        todayQueue.date = todaySeconds;
        return true;
      }
    }
    return false;
  }

  getStatistics = async () => {
    const { data, response } = await makeRequest('GET', `users/${this.user.userId}/statistics`,
      this.user.token);
    if (!response.ok) {
      if (response.status === 404) {
        const putData = { learnedWords: 0, optional: {} };
        const { response: postResponse } = await makeRequest(
          'PUT',
          `users/${this.user.userId}/statistics`,
          this.user.token,
          putData,
        );
        if (!postResponse.ok) {
          throw new Error(
            `POST Statisctics failed with ${postResponse.status} ${postResponse.statusText}`,
          );
        } else {
          this.statistics = data;
        }
      } else {
        throw new Error(
          `Get Statisctics failed with ${response.status} ${response.statusText}`,
        );
      }
    } else {
      this.statistics = data;
      delete this.statistics.id;
    }
  };

  updateStatistics = async () => {
    const statistics = { ...this.statistics };
    if (!this.statistics.optional) {
      this.statistics.optional = {};
    }
    this.statistics.optional.todayQueue = this.wordQueue.getQueueToSave();
    const { data, response } = await makeRequest(
      'PUT',
      `users/${this.user.userId}/statistics`,
      this.user.token,
      statistics,
    );
    if (!response.ok) {
      throw new Error(
        `PUT Statistics failed with ${response.status} ${response.statusText}`,
      );
    }
    return data;
  };

  /**
   * @param {Word} word
   */
  updateWord = async (word) => {
    let method = 'PUT';
    if (parameters.phase[word.repetitionPhase].name === parameters.phaseNames.new) {
      method = 'POST';
    }
    const wordToPost = {
      difficulty: `${parameters.difficulty[word.difficulty].name}`,
      optional: {
        difficultyId: word.difficulty,
        time: Math.ceil(word.time / 1000),
        repetitionPhaseId: word.repetitionPhase,
        lastMistake: word.lastMistake,
        totalMistakes: word.totalMistakes,
        totalRepetition: word.totalRepetition,
        nextRepetition: Math.ceil(word.getNextRepetition().getTime() / 1000),
      },
    };
    const { data, response } = await makeRequest(method, `users/${this.user.userId}/words/${word.definition.wordId}`,
      this.user.token, wordToPost);
    if (!response.ok) {
      throw new Error(`${method} Word failed with ${response.status} ${response.statusText}`);
    }
    return data;
  };

  queryWords = async (params) => {
    const { data: dataArray, response } = await makeRequest(
      'GET',
      `users/${this.user.userId}/aggregatedWords?group=0`,
      this.user.token,
      undefined,
      params,
    );
    if (!response.ok) {
      throw new Error(`GET Words failed with ${response.status} ${response.statusText}`);
    }
    const [data] = dataArray;
    const words = data.paginatedResults;
    return { data: words, response };
  }

  queryUserWords = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySeconds = Math.ceil(today.getTime() / 1000);
    const params = {
      wordsPerPage: this.settings.MAX_WORDS - this.settings.MAX_NEW_WORDS,
      filter: JSON.stringify({ $or: [{ 'userWord.optional.nextRepetition': { $lte: todaySeconds } }] }),
    };
    return this.queryWords(params);
  }

  queryNewWords = async () => {
    const params = {
      wordsPerPage: this.settings.MAX_NEW_WORDS,
      filter: JSON.stringify({ $or: [{ userWord: null }] }),
    };
    return this.queryWords(params);
  }

  getWordsFromSavedQueue = async () => {
    const words = this.statistics.optional.todayQueue.queue.map((qWord) => ({ word: qWord.w }));
    const filter = {
      $or: words,
    };
    const params = {
      wordsPerPage: words.length,
      filter: JSON.stringify(filter),
    };
    return this.queryWords(params);
  }

  endQueue = async () => {
    this.wordQueue.endQueue();
    await Promise.all(this.wordQueue.getWords().forEach((word) => this.updateWord(word)));
    await this.updateStatistics();
  }
}
