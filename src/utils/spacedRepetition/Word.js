import parameters from './parameters';

export default class Word {
  /**
   * Constructor to create a word
   * @param {WordQueue} wordQueue if this word should be repeated
   * @param {WordDefinition} definition word definition
   * @param {Object} param param
   * @param {number} param.difficultyId from new to completed
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
      time = 0,
      repetitionPhaseId = 0,
      lastMistake = 0,
      totalMistakes = 0,
      mistakes = '0000000',
      totalRepetition = 0,
    },
  ) {
    this.definition = definition;
    this.difficulty = difficultyId;
    this.time = time;
    this.repetitionPhase = repetitionPhaseId;
    this.lastMistake = lastMistake;
    this.mistakes = mistakes;
    this.totalMistakes = totalMistakes;
    this.totalRepetition = totalRepetition;
    this.wordQueue = wordQueue;
    this.userTimezoneOffset = (new Date()).getTimezoneOffset() * 60000;
  }

  setTime = () => {
    this.time = new Date().getTime();
    this.totalRepetition += 1;
  }

  setMistake = () => {
    this.lastMistake = new Date().getTime();
    this.totalMistakes += 1;
    this.mistakes = `${this.mistakes.substring(0, this.mistakes.length - 1)}0`;
    this.upgradeDifficulty();
  }

  shiftMistakes = () => {
    this.mistakes.substring(1);
    this.mistakes += '0';
  }

  getWhenWasLastMistake = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastMistakeDate = new Date(this.lastMistake);
    return Math.ceil((today - lastMistakeDate) / 1000 / 60 / 60 / 24);
  }

  upgradePhase = () => {
    if (this.repetitionPhase === 0) {
      this.repetitionPhase = 3;
    } else if (this.repetitionPhase < parameters.phase.length - 1) {
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
    return parameters.difficulty[this.difficulty].name;
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
    if (this.getWhenWasLastMistake() >= parameters.difficulty[this.difficulty].maxDays) {
      if (this.difficulty + 1 < parameters.difficulty.length) {
        this.difficulty += 1;
      }
    }
  }

  downgradeDifficulty = () => {
    const dif = this.getDifficulty();
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
