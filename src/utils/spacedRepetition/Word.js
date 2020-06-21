import parameters from './parameters';
import WordDefinition from './WordDefinition';

export default class Word {
  /**
   * Constructor to create a word
   * @param {WordDefinition} definition word definition
   * @param {Object} param param
   * @param {number} param.difficultyId from new to completed
   * @param {number} param.time time when word was repeated
   * @param {number} param.todayCount count of repetitions today
   * @param {number} param.repetitionPhaseId current repetition phase
   * @param {number} param.missTimes when word was missed
   * @param {[number]} param.mistakes dates of mistakes
   * @param {number} param.totalMistakes total mistakes in this word
   * @param {number} param.totalRepetition total mistakes in this word
   * @param {boolean} param.isAgain if this word should be repeated
   */
  constructor(
    definition,
    {
      difficultyId = 0,
      time = 0,
      todayCount = 0,
      repetitionPhaseId = 0,
      missTimes = 0,
      mistakes = [],
      totalMistakes = 0,
      totalRepetition = 0,
      isAgain = false,
    },
  ) {
    this.definition = definition;
    this.difficulty = difficultyId;
    this.time = time;
    this.todayCount = todayCount;
    this.repetitionPhase = repetitionPhaseId;
    this.missTimes = missTimes;
    this.mistakes = mistakes;
    this.totalMistakes = totalMistakes;
    this.totalRepetition = totalRepetition;
    this.isAgain = isAgain;
  }

  setTime = () => {
    this.time = new Date().getTime();
  }

  setMistake = () => {
    this.mistakes.push(new Date().getTime());
  }

  upgradePhase = () => {
    if (this.repetitionPhase < parameters.phase.length - 1) {
      this.repetitionPhase += 1;
    }
    this.missTimes = 0;
  }

  downgradePhase = () => {
    if (parameters.maxMissTimes < this.missTimes) {
      this.repetitionPhase = this.getNextPhase().downgragePhase;
      this.missTimes = 0;
    }
  }

  updateMissed = () => {
    if (this.isMissed()) {
      this.missTimes += 1;
    }
  }

  isMissed = () => {
    const nextPhase = this.getNextPhase();
    if (nextPhase.delta === parameters.unlimited) {
      return false;
    }
    const currentTime = new Date().getTime();
    const deltaTime = (currentTime - this.time) / 1000;
    if (deltaTime > nextPhase.time + nextPhase.delta) {
      return true;
    }
    return false;
  }

  getNextPhase = () => {
    if (this.repetitionPhase < parameters.phase.length - 1) {
      return parameters.phase[this.repetitionPhase + 1];
    }
    return parameters.phase[this.repetitionPhase];
  }

  setDifficulty = (difficulty) => {
    this.difficulty = difficulty;
  }

  changeDifficulty = () => {
    // TODO
  }

  prepareStatistics = () => {
    // TODO
  }

  /**
   * @return {number} when this word will be repeated in days
   */
  getNextRepetition() {
    if (this.isAgain) {
      return 0;
    }
    const currentDate = new Date();
    if (this.difficulty.name === parameters.difficultyNames.new) {
      const nextDate = new Date();
      nextDate.setSeconds(currentDate.getSeconds() + this.getNextPhase().time);
      if (currentDate.getDate() !== nextDate.getDate()) {
        return 1;
      }
      return 0;
    }
    if (this.difficulty.name === parameters.difficultyNames.evaluation) {
      if (this.todayCount < parameters.difficultyEvaluationTimesPerDay) {
        return 0;
      }
      return 1;
    }
    const nextDate = new Date(this.time);
    nextDate.setSeconds(nextDate.getSeconds() + this.getNextPhase().time);
    const dayToday = currentDate.getDate();
    const dayNext = currentDate.getDate();
    const daysInMonths = ([31, Word.isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])[currentDate.getMonth()];
    return (daysInMonths + dayToday - dayNext) % daysInMonths;
  }

  /**
   * @param {Date} date
   */
  static isLeapYear(date) {
    return ((date.getFullYear() % 4 === 0) && (date.getFullYear() % 100 !== 0)) || (date.getFullYear() % 400 === 0);
  }
}
