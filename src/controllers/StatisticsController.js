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

  updateAll = async (isEducation, isAnswered, isNew, isLastOccurence, todayQueue) => {
    const todayStatistics = this.updateTodayStatistics(isEducation, isAnswered, isNew, isLastOccurence);
    const seconds = getTodaySeconds();
    const longStatistics = this.updateLongStatistics(`${seconds}`, isLastOccurence);
    statisticsModel.save({ todayStatistics, longStatistics, todayQueue });
  }

  updateTodayStatistics = (isEducation, isAnswered, isNew, isLastOccurence) => {
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
      } else {
        todayStatistics.incorrectAnswers += 1;
        todayStatistics.currentStrike = 0;
        if (isNew) {
          todayStatistics.newWords += 1;
        }
      }
    } else if (isNew) {
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

  updateQueue = async (todayQueue) => {
    statisticsModel.save({ todayQueue });
  }

  getPassedCount = () => {
    if (this.get() === null) {
      return 0;
    }
    return statisticsModel.getPassedCount();
  }

  reset = () => {
    statisticsModel.reset();
  }
}

const statisticsController = new StatisticsController();

export default statisticsController;
