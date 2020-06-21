import Difficulty from './Difficulty';
import IntervalPhase from './IntervalPhase';

const phaseNames = {
  fiveSec: '5s',
  twentyFiveSec: '25s',
  twoMin: '2min',
  tenMin: '10min',
  oneH: '1h',
  fiveH: '5h',
  fiveD: '5d',
  twentyFiveD: '25d',
  fourM: '4m',
};
const difficultyNames = {
  new: 'new',
  evaluation: 'evaluation',
  easy: 'easy',
  normal: 'normal',
  hard: 'hard',
  completed: 'completed',
};
const unlimited = -1;

export default {
  difficultyNames,
  difficulty: [
    new Difficulty(difficultyNames.new, unlimited, unlimited, unlimited, 1),
    new Difficulty(difficultyNames.evaluation, unlimited, unlimited, 3, 1),
    new Difficulty(difficultyNames.easy, 0, unlimited, 30, 7),
    new Difficulty(difficultyNames.normal, unlimited, unlimited, 14, 3),
    new Difficulty(difficultyNames.hard, unlimited, unlimited, 7, 1),
    new Difficulty(difficultyNames.completed, unlimited, unlimited, unlimited, unlimited),
  ],
  phaseNames,
  phase: [
    new IntervalPhase(phaseNames.fiveSec, 5, unlimited),
    new IntervalPhase(phaseNames.twentyFiveSec, 25, unlimited),
    new IntervalPhase(phaseNames.twoMin, 120, unlimited),
    new IntervalPhase(phaseNames.tenMin, 600, 1200, 0),
    new IntervalPhase(phaseNames.oneH, 3600, unlimited),
    new IntervalPhase(phaseNames.fiveH, 18000, 18000, 4),
    new IntervalPhase(phaseNames.fiveD, 432000, unlimited),
    new IntervalPhase(phaseNames.twentyFiveD, 2160000, unlimited),
    new IntervalPhase(phaseNames.fourM, 10368000, unlimited),
  ],
  maxMissTimes: 3,
  minPhaseOnCompleted: 5,
  difficultyEvaluationDays: 3,
  difficultyEvaluationTimesPerDay: 2,
  unlimited,
};
