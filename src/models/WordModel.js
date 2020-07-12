import WordQueue from '../utils/spacedRepetition/WordQueue';
import wordQueueSubject from '../utils/observers/WordQueueSubject';
import { makeRequest } from '../utils/responseFromServer';
import statisticsController from '../controllers/StatisticsController';
import { getTodaySeconds } from '../utils/time';
import settingsController from '../controllers/SettingsController';
import settingsNames from '../constants/settingsNames';

export default class WordModel {
  constructor() {
    this.wordQueue = null;
  }

  init = async () => {
    if (!this.hasQueueForToday()) {
      await this.makeQueue();
    } else {
      this.wordQueue = new WordQueue();
      const { data: words } = await this.getWordsFromSavedQueue();
      this.wordQueue.usePredefinedQueue(statisticsController.get().optional.todayQueue, words);
      wordQueueSubject.notify(this.wordQueue);
    }
  }

  makeQueue = async () => {
    const { data: userWords } = await this.queryUserWords();
    const { data: newWords } = await this.queryNewWords();
    this.wordQueue = new WordQueue();
    this.wordQueue.makeQueue(newWords, userWords);
    await this.initStatistics();
    wordQueueSubject.notify(this.wordQueue);
  }

  hasQueueForToday = () => {
    const statistics = statisticsController.get();
    const { optional: { todayQueue } } = statistics;
    const todaySeconds = getTodaySeconds();
    if (todayQueue) {
      if (!todayQueue.queue || todayQueue.queue.length === 0) {
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

  initStatistics = async () => {
    statisticsController.resetQueue(this.wordQueue.getQueueToSave());
  }

  updateStatistics = async () => {
    statisticsController.updateQueue(this.wordQueue.getQueueToSave());
  };

  /**
   * @param {Word} word
   * @param {boolean} isNew
   */
  updateWord = async (word, isNew) => {
    let method = 'PUT';
    if (isNew) {
      method = 'POST';
    }
    const wordToPost = {
      difficulty: `${word.hasUserDifficulty() ? word.getUserDifficulty() : word.getAlgDifficulty()}`,
      optional: {
        difficultyId: word.difficulty,
        time: Math.ceil(word.time / 1000),
        firstTime: word.firstTime,
        repetitionPhaseId: word.repetitionPhase,
        lastMistake: Math.ceil(word.lastMistake / 1000),
        mistakes: word.mistakes,
        totalMistakes: word.totalMistakes,
        totalRepetition: word.totalRepetition,
        isDeleted: word.isDeleted,
        nextRepetition: Math.ceil(word.getNextRepetition().getTime() / 1000),
      },
    };
    if (word.userDifficulty) {
      wordToPost.optional.userDifficultyId = word.userDifficulty;
    }
    const { data, response } = await makeRequest(method, `users/%%userId%%/words/${word.definition.wordId}`, wordToPost);
    if (!response.ok) {
      if (response.status === 404) {
        const { data: postData, response: postResponse } = await makeRequest('POST',
          `users/%%userId%%/words/${word.definition.wordId}`,
          wordToPost);
        if (!postResponse.ok) {
          console.debug(postData);
          throw new Error(`${method} Word failed with ${postResponse.status} ${postResponse.statusText}`);
        }
        return postData;
      } else {
        console.debug(data);
        throw new Error(`${method} Word failed with ${response.status} ${response.statusText}`);
      }
    }
    return data;
  };

  queryWords = async (params) => {
    const { data: dataArray, response } = await makeRequest(
      'GET',
      'users/%%userId%%/aggregatedWords',
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
    const maxNewWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.newWords);
    const maxWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.allWords);
    let maxCount = maxWords - maxNewWords * 5;
    if (maxCount < 0) {
      maxCount = 0;
    }
    const todaySeconds = getTodaySeconds();
    const params = {
      wordsPerPage: maxCount,
      filter: JSON.stringify({
        $and: [{ 'userWord.optional.nextRepetition': { $lte: todaySeconds } },
          {
            $or: [{ 'userWord.optional.isDeleted': false },
              { 'userWord.optional.isDeleted': null }],
          }],
      }),
    };
    return this.queryWords(params);
  }

  queryNewWords = async () => {
    const maxNewWords = settingsController.getSettingByName(settingsNames.sections.education, settingsNames.items.newWords);
    const params = {
      wordsPerPage: maxNewWords,
      filter: JSON.stringify({ $or: [{ userWord: null }] }),
    };
    return this.queryWords(params);
  }

  getWordsFromSavedQueue = async () => {
    let words = statisticsController.get().optional.todayQueue.queue.map((qWord) => (qWord.w));
    words = words.filter((word, pos) => words.indexOf(word) === pos);
    words = words.map((word) => ({ word }));
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

  reset = () => {
    this.wordQueue = null;
  }
}
