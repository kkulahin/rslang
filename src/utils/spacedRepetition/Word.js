import parameters from './parameters';
import wordCanUpgradeSubject from '../observers/WordCanUpgradeSubject';
import { checkDayDifferenceAbs } from '../time';

export default class Word {
  /**
   * Constructor to create a word
   * @param {WordQueue} wordQueue if this word should be repeated
   * @param {WordDefinition} definition word definition
   * @param {Object} param param
   * @param {number} param.difficultyId from new to completed
   * @param {number} param.userDifficultyId from easy to hard - set by user
   * @param {number} param.time time when word was repeated
   * @param {number} param.repetitionPhaseId current repetition phase
   * @param {number} param.lastMistake dates of mistakes
   * @param {number} param.totalMistakes total mistakes in this word
   * @param {number} param.totalRepetition total mistakes in this word
   */
  constructor(
    wordQueue,
    definition,
    {
      difficultyId = 0,
      userDifficultyId = null,
      time = 0,
      repetitionPhaseId = 0,
      lastMistake = 0,
      totalMistakes = 0,
      mistakes = 'zzzzzzz',
      totalRepetition = 0,
    },
  ) {
    this.definition = definition;
    this.difficulty = difficultyId;
    this.userDifficulty = userDifficultyId;
    if (this.userDifficulty !== null && this.userDifficulty !== this.difficulty) {
      this.difficulty = this.userDifficulty;
    }
    this.time = time * 1000;
    this.repetitionPhase = repetitionPhaseId;
    this.lastMistake = lastMistake * 1000;
    this.mistakes = mistakes;
    this.totalMistakes = totalMistakes;
    this.totalRepetition = totalRepetition;
    this.wordQueue = wordQueue;
  }

  setTime = () => {
    this.time = new Date().getTime();
    this.totalRepetition += 1;
    if (this.lastMistake === 0) {
      this.mistakes = `${this.mistakes.substr(0, this.mistakes.length - 1)}0`;
    } else if (checkDayDifferenceAbs(new Date(), new Date(this.lastMistake)) > 0) {
      this.mistakes = `${this.mistakes.substr(1)}0`;
    }
  }

  setMistake = () => {
    if (this.lastMistake > 0 && checkDayDifferenceAbs(new Date(), new Date(this.lastMistake)) > 0) {
      this.mistakes = `${this.mistakes.substr(1)}1`;
    } else {
      this.mistakes = `${this.mistakes.substr(0, this.mistakes.length - 1)}1`;
    }
    this.lastMistake = new Date().getTime();
    this.totalMistakes += 1;
    this.upgradeDifficulty();
  }

  isNew = () => parameters.difficultyNames.new === this.getAlgDifficulty();

  getWhenWasLastMistake = () => {
    if (this.mistakes.indexOf('z') > -1) {
      return 0;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastMistakeDate = new Date(this.lastMistake);
    return Math.ceil((today - lastMistakeDate) / 1000 / 60 / 60 / 24);
  }

  upgradePhase = () => {
    if (this.repetitionPhase < parameters.phase.length - 1) {
      this.repetitionPhase += 1;
    }
  }

  getNextPhase = () => {
    if (this.repetitionPhase < parameters.phase.length - 1) {
      return parameters.phase[this.repetitionPhase + 1];
    }
    return parameters.phase[this.repetitionPhase];
  }

  getNewPhases = () => parameters.phase.filter((e, i) => i < 4);

  getDifficulty = () => {
    const diff = this.hasUserDifficulty() ? this.getUserDifficulty() : this.getAlgDifficulty();
    if (diff === parameters.difficultyNames.new) {
      return parameters.difficultyNames.normal;
    }
    if (diff === parameters.difficultyNames.completed) {
      return parameters.difficultyNames.easy;
    }
    return diff;
  }

  getAlgDifficulty = () => parameters.difficulty[this.difficulty].name;

  hasUserDifficulty = () => this.userDifficulty !== null;

  getUserDifficulty = () => parameters.difficulty[this.userDifficulty].name;

  /**
   * @param {string} difficulty ['easy', 'normal', 'hard']
   */
  setUserDifficulty = (difficulty) => {
    parameters.difficulty.forEach((dif, i) => {
      if (dif.name === difficulty) {
        this.userDifficulty = i;
        this.difficulty = i;
      }
    });
  }

  /**
   * set difficulty to predefined value
   * @param {number|string} difficulty difficulty - can be index or name
   */
  setDifficulty = (difficulty) => {
    if (typeof difficulty === 'number') {
      this.difficulty = difficulty;
    } else if (typeof difficulty === 'string') {
      parameters.difficulty.forEach((dif, i) => {
        if (dif.name === difficulty) {
          this.difficulty = i;
        }
      });
    }
  }

  upgradeDifficulty = () => {
    const diff = this.hasUserDifficulty() ? this.getUserDifficulty() : this.getAlgDifficulty();
    if (diff === parameters.difficultyNames.new) {
      this.difficulty = parameters.difficulty.reduce((newIndex, dif, index) => {
        if (dif.name === parameters.difficultyNames.normal) {
          return index;
        }
        return newIndex;
      }, -1);
    } else if (this.getWhenWasLastMistake() >= parameters.difficulty[this.difficulty].maxDays) {
      if (this.difficulty + 1 < parameters.difficulty.length) {
        this.difficulty += 1;
      }
    }
    if (this.difficulty !== this.userDifficulty) {
      wordCanUpgradeSubject.notify(parameters.difficulty[this.difficulty].name);
    }
  }

  downgradeDifficulty = () => {
    const dif = this.getAlgDifficulty();
    if (dif === parameters.difficultyNames.normal) {
      const mistakesCount = this.mistakes.split('').reduce((count, day) => {
        if (day === '1') {
          return count + 1;
        }
        return count;
      }, 0);
      if (mistakesCount > 3) {
        this.setDifficulty(parameters.difficultyNames.hard);
      }
    } else if (dif === parameters.difficultyNames.easy) {
      if (this.mistakes[this.mistakes.length - 1] === '1') {
        this.setDifficulty(parameters.difficultyNames.normal);
      }
    } else if (dif === parameters.difficultyNames.completed) {
      if (this.mistakes[this.mistakes.length - 1] === '1') {
        this.setDifficulty(parameters.difficultyNames.easy);
      }
    }
  }

  replaceDifficulty = (doReplace) => {
    if (doReplace) {
      this.userDifficulty = this.difficulty;
    } else {
      this.difficulty = this.userDifficulty;
    }
  }

  /**
   * @return {number} when this word will be repeated in days
   */
  getNextRepetitionInDays() {
    if (this.wordQueue.queue.some((qWord) => qWord.word === this.word)) {
      return 0;
    }
    const nextDate = this.getNextRepetition();
    const today = new Date();
    const diff = Math.ceil((today - nextDate) / 1000 / 60 / 60 / 24);
    return diff <= 0 ? 1 : diff;
  }

  /**
   * @return {Date} when this word will be repeated in days
   */
  getNextRepetition() {
    const allTimes = [];
    allTimes.push(this.getNextEducationTimeFull());
    const repTime = this.getNextRepetitionTimeFull();
    if (repTime) {
      allTimes.push(repTime);
    }
    allTimes.sort((a, b) => a - b);
    return allTimes[0];
  }

  getNextEducationTimeFull = () => {
    const nextDate = new Date(this.getNextPhase().time * 1000 + this.time);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
  }

  getNextEducationTime = () => {
    if (this.time === 0) {
      return this.getNewPhases().map((phase) => this.time + (phase.time + Math.random(10)) * 1000);
    }
    const nextTime = this.getNextEducationTimeFull();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (nextTime - today <= 0) {
      return [nextTime.getTime()];
    }
    return [];
  }

  getNextRepetitionTimeFull = () => {
    const nextDate = new Date(this.time);
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + parameters.difficulty[this.difficulty].period);
    return nextDate;
  }

  getNextRepetitionTime = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = this.getNextRepetitionTimeFull();
    return nextDate - currentDate <= 0 ? nextDate.getTime() : null;
  }
}
