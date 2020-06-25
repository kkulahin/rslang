import fetch from 'node-fetch';
// import Word from './Word';
import parameters from './parameters';
import WordQueue from './WordQueue';

export default class WordModel {
  /**
  * Model to work with a queue of words
  * @param {Object} user
  * @param {string} user.id
  * @param {string} user.token
  */
  constructor(user, settings) {
    this.user = user;
    this.settings = settings;
  }

  init = async () => {
    await this.getStatistics();
    if (!this.hasQueueForToday()) {
      const userWords = await this.queryUserWords();
      const newWords = await this.queryNewWords();
      this.wordQueue = new WordQueue(this.settings);
      this.wordQueue.makeQueue(newWords, userWords);
    } else {
      this.wordQueue = new WordQueue(this.settings);
      const words = await this.getWordsFromSavedQueue();
      this.wordQueue.usePredefinedQueue(this.statistics.todayQueue, words);
    }
  }

  hasQueueForToday = () => {
    const { todayQueue } = this.statistics;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySeconds = Math.ceil(today.getTime() / 1000);
    if (todayQueue) {
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
    const url = new URL(`https://afternoon-falls-25894.herokuapp.com/users/${this.user.id}/${table}`);
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
    }
  };

  updateStatistics = async () => {
    const statistics = { ...this.statistics };
    this.statistics.todayQueue = this.wordQueue.getQueueToSave();
    const { url, options } = this.makeRequest(
      'PUT',
      'statistics',
      statistics,
    );
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `PUT Statisctics failed with ${response.status} ${response.statusText}`,
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

  gueryNewWords = async () => {
    const params = {
      wordsPerPage: this.settings.MAX_NEW_WORDS,
      filter: JSON.stringify({ $or: [{ userWord: null }] }),
    };
    return this.queryWords(params);
  }

  getWordsFromSavedQueue = async () => {
    const words = this.settings.todayQueue.queue.map((qWord) => ({ word: qWord.w }));
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
    await Promise.all(this.wordQueue.getWordsToSave().forEach((word) => this.updateWord(word)));
    await this.updateStatistics();
  }
}
