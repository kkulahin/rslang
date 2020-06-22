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
    this.changeDifficulty();
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
  getNextRepetition() {
    return this.wordController.queue.any((qWord) => qWord.word === this.word);
  }

  getNextEducationTime = () => {
    if (this.time === 0) {
      return this.getNewPhases().map((phase) => this.time + (phase.time + Math.random(10)) * 1000);
    }
    const nextTime = new Date(this.getNextPhase().time + this.time * 1000);
    const today = new Date();
    if (nextTime.getDate() === today.getDate()
      && nextTime.getMonth() === today.getMonth()
      && nextTime.getFullYear() === today.getFullYear()) {
      return [nextTime];
    }
    return [];
  }

  getNextRepetitionTime = () => {
    const currentDate = new Date();
    const nextDate = new Date(this.time);
    nextDate.setSeconds(nextDate.getSeconds() + this.getNextPhase().time);
    const dayToday = currentDate.getDate();
    const dayNext = nextDate.getDate();
    return dayToday === dayNext ? dayToday : undefined;
  }
}
