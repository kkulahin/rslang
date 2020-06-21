export default class Difficulty {
  /**
   * Class to use with Word
   * @param {string} name name of the difficulty phace from new to completed
   * @param {number} maxMistakes max mistakes allowed in this phase
   * @param {number} delta period in days for mistakes
   * @param {number} maxDays duration of the phase without mistakes
   * @param {number} period repetition period
   */
  constructor(name, maxMistakes, delta, maxDays, period) {
    this.name = name;
    this.maxMistakes = maxMistakes;
    this.delta = delta;
    this.maxDays = maxDays;
    this.period = period;
  }
}
