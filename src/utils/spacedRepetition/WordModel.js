import fetch from 'node-fetch';
// import Word from './Word';
import parameters from './parameters';
import WordQueue from './WordQueue';
import { getCookie } from '../cookie';
import wordQueueSubject from '../observers/WordQueueSubject';

export default class WordModel {
  /**
  * Model to work with a queue of words
  * @param {Object} settings
  */
  constructor(settings) {
    this.settings = settings;
    this.user = JSON.parse(getCookie('auth'));
    console.log(this.user);
    console.log(this.settings);
  }

  init = async () => {
    await this.getStatistics();
    if (!this.hasQueueForToday()) {
      console.log('build queue');
      const userWords = await this.queryUserWords();
      const newWords = await this.queryNewWords();
      this.wordQueue = new WordQueue(this.settings);
      this.wordQueue.makeQueue(newWords, userWords);
      this.updateStatistics();
    } else {
      this.wordQueue = new WordQueue(this.settings);
      const words = await this.getWordsFromSavedQueue();
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
    console.log(words);
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

  makeRequest = (method, table, body, params = {}) => {
    const url = new URL(`https://afternoon-falls-25894.herokuapp.com/users/${this.user.userId}/${table}`);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    const request = {
      url,
      options: {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      },
    };
    if (body) {
      request.options.body = JSON.stringify(body);
    }
    return request;
  };

  getStatistics = async () => {
    const { url, options } = this.makeRequest('GET', 'statistics');
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 404) {
        const data = { learnedWords: 0, optional: {} };
        const { url: postUrl, options: postOptions } = this.makeRequest(
          'PUT',
          'statistics',
          data,
        );
        const responsePost = await fetch(postUrl, postOptions);
        if (!responsePost.ok) {
          throw new Error(
            `POST Statisctics failed with ${responsePost.status} ${responsePost.statusText}`,
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
      const data = await response.json();
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
    console.log(JSON.stringify(this.statistics, null, 2));
    const { url, options } = this.makeRequest(
      'PUT',
      'statistics',
      statistics,
    );
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `PUT Statistics failed with ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
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
    const { url, options } = this.makeRequest(method, `words/${word.definition.wordId}`, wordToPost);
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`${method} Word failed with ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  queryWords = async (params) => {
    const { url, options } = this.makeRequest('GET', 'aggregatedWords', undefined, params);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`GET Words failed with ${response.status} ${response.statusText}`);
    }
    const [data] = await response.json();
    const words = data.paginatedResults;
    return words;
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
