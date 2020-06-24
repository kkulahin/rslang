import parameters from './parameters';

export default class Word {
  /**
   * Constructor to create a word
   * @param {WordController} wordController if this word should be repeated
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
    wordController,
    definition,
    {
      difficultyId = 0,
      time = 0,
      repetitionPhaseId = 0,
      lastMistake = 0,
      totalMistakes = 0,
      totalRepetition = 0,
    },
  ) {
    this.definition = definition;
    this.difficulty = difficultyId;
    this.time = time;
    this.repetitionPhase = repetitionPhaseId;
    this.lastMistake = lastMistake;
    this.totalMistakes = totalMistakes;
    this.totalRepetition = totalRepetition;
    this.wordController = wordController;
  }

  setTime = () => {
    this.time = new Date().getTime();
    this.totalRepetition += 1;
  }

  setMistake = () => {
    this.lastMistake = new Date().getTime();
    this.totalMistakes += 1;
    this.upgradeDifficulty();
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

  setDifficulty = (difficulty) => {
    this.difficulty = difficulty;
  }

  getWhenWasLastMistake = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastMistakeDate = new Date(this.lastMistake);
    return Math.ceil((today - lastMistakeDate) / 1000 / 60 / 60 / 24);
  }

  upgradeDifficulty = () => {
    if (this.getWhenWasLastMistake() >= parameters.difficulty[this.difficulty].maxDays) {
      if (this.difficulty + 1 < parameters.difficulty.length) {
        this.difficulty += 1;
      }
    }
  }

  downgradeDifficulty = () => {
  }

  prepareStatistics = () => {
    // TODO
  }

  /**
   * @return {number} when this word will be repeated in days
   */
  getNextRepetitionInDays() {
    if (this.wordController.queue.some((qWord) => qWord.word === this.word)) {
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
      return [nextTime];
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
    return nextDate - currentDate <= 0;
  }
}
