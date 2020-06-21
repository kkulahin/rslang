export default class Interval {
  /**
   * Class to define Word interval repetition phase
   * @param {string} name the name odf the phase
   * @param {number} time the time of the interval in seconds
   * @param {number} delta the max time allowed after interval is passed in seconds
   * @param {number} ddowngradePhase the id of the phase to downgrade
   */
  constructor(name, time, delta, downgradePhase) {
    this.name = name;
    this.time = time;
    this.delta = delta;
    this.downgradePhase = downgradePhase;
  }
}