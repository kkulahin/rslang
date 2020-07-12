import statisticsModel from '../models/StatisticsModel';
import { getTodaySeconds } from '../utils/time';

class StatisticsController {
  get = () => {
    if (statisticsModel.get() === null) {
      statisticsModel.getFromServer();
    }
    return statisticsModel.get();
  }

  getAsync = async () => {
    if (statisticsModel.get() === null) {
      await statisticsModel.getFromServer();
    }
    return statisticsModel.get();
  }

  updateAll = async (isEducation, isAnswered, wasNew, isLastOccurence, todayQueue) => {
    const todayStatistics = this.updateTodayStatistics(isEducation, isAnswered, wasNew, isLastOccurence);
    const seconds = getTodaySeconds();
    const longStatistics = this.updateLongStatistics(`${seconds}`, isLastOccurence);
    statisticsModel.save({ todayStatistics, longStatistics, todayQueue });
  }

  updateTodayStatistics = (isEducation, isAnswered, wasNew, isLastOccurence) => {
    const { optional: { todayStatistics } } = statisticsModel.get();
    if (!isEducation) {
      if (isAnswered) {
        todayStatistics.correctAnswers += 1;
        if (isLastOccurence) {
          todayStatistics.passedWords += 1;
        }
        todayStatistics.currentStrike += 1;
        if (todayStatistics.currentStrike > todayStatistics.strike) {
          todayStatistics.strike = todayStatistics.currentStrike;
        }
        if (wasNew) {
          todayStatistics.newWords += 1;
        }
      } else {
        todayStatistics.incorrectAnswers += 1;
        todayStatistics.currentStrike = 0;
      }
    } else if (wasNew) {
      todayStatistics.newWords += 1;
    }
    todayStatistics.passedCards += 1;
    return todayStatistics;
  }

  updateLongStatistics = (date, isLast) => {
    const { optional: { longStatistics } } = statisticsModel.get();
    if (isLast) {
      longStatistics[date] += 1;
    }
    return longStatistics;
  }

  updateQueue = async (todayQueue) => statisticsModel.save({ todayQueue });

  resetToday = async () => {
    const { optional: { todayStatistics } } = statisticsModel.get();
    todayStatistics.newWords = 0;
    todayStatistics.passedCards = 0;
    todayStatistics.incorrectAnswers = 0;
    todayStatistics.correctAnswers = 0;
    todayStatistics.passedWords = 0;
    todayStatistics.currentStrike = 0;
    todayStatistics.strike = 0;
    return statisticsModel.save({ todayStatistics });
  }

  resetQueue = async (todayQueue) => {
    const { optional: { todayStatistics } } = statisticsModel.get();
    todayStatistics.newWords = 0;
    todayStatistics.passedCards = 0;
    todayStatistics.incorrectAnswers = 0;
    todayStatistics.correctAnswers = 0;
    todayStatistics.passedWords = 0;
    todayStatistics.currentStrike = 0;
    todayStatistics.strike = 0;
    const newTodayQueue = { ...todayQueue };
    newTodayQueue.queue = todayQueue.queue.filter((qWord) => !qWord.isA);
    return statisticsModel.save({ todayQueue: newTodayQueue, todayStatistics });
  }

  getPassedCount = () => {
    if (this.get() === null) {
      return null;
    }
    return statisticsModel.getPassedCount();
  }

  reset = () => {
    statisticsModel.reset();
  }
}

const statisticsController = new StatisticsController();

export default statisticsController;
