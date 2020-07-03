import statisticsModel from '../models/StatisticsModel';

class StatisticsController {
  get = () => {
    if (statisticsModel.get() === null) {
      statisticsModel.getFromServer();
    }
    return statisticsModel.get();
  }

  updateTodayStatistics = (isEducation, isAnswered, isNew, isLastOccurence) => {
    const { optional: { todayStatistics } } = statisticsModel.get();
    if (!isEducation) {
      if (isAnswered) {
        todayStatistics.passedCards += 1;
        todayStatistics.correctAnswers += 1;
        // todo
        todayStatistics.passedWords += 1;
        todayStatistics.currentStrike += 1;
        if (todayStatistics.currentStrike > todayStatistics.strike) {
          todayStatistics.strike = todayStatistics.currentStrike;
        }
      } else {
        todayStatistics.incorrectAnswers += 1;
        todayStatistics.currentStrike = 0;
        todayStatistics.passedCards += 1;
        if (isNew) {
          todayStatistics.newWords += 1;
        }
      }
    } else {
      if (isNew) {
        todayStatistics.newWords += 1;
      }
      todayStatistics.passedCards += 1;
    }

    statisticsModel.save({ todayStatistics });
  }

  updateLongStatistics = (date, queue, queuePosition, word) => {
    const { optional: { longStatistics } } = statisticsModel.get();
    if (queue.some((element, index) => {
      if (index > queuePosition) {
        return false;
      }
      if (element === word) {
        return true;
      }
      return false;
    })) {
      longStatistics[date] += 1;
    }
  }

  updateQueue = () => {

  }

  getPassedCount = () => {
    if (statisticsModel.get() === null) {
      return 0;
    }
    return statisticsModel.getPassedCount();
  }
}

const statisticsController = new StatisticsController();

export default statisticsController;
