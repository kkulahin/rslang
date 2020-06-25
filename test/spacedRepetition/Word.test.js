import Word from '../../src/utils/spacedRepetition/Word';
import parameters from '../../src/utils/spacedRepetition/parameters';
import WordQueue from '../../src/utils/spacedRepetition/WordQueue';

jest.mock('../../src/utils/spacedRepetition/WordQueue');

beforeEach(() => {
  WordQueue.mockClear();
});

describe('change difficulty', () => {
  parameters.difficulty.forEach((element, id) => {
    describe('last mistake should be:', () => {
      if (id > 0 && id < 4) {
        test(`${element.maxDays} days ago for ${element.name}`, () => {
          const word = new Word(null, null, {});
          const today = new Date();
          today.setDate(today.getDate() - element.maxDays);
          word.lastMistake = today.getTime();
          expect(word.getWhenWasLastMistake()).toBe(element.maxDays);
        });
      }
    });
  });

  test('difficulty should be upgraded', () => {
    const word = new Word(null, null, {});
    const today = new Date();
    today.setDate(today.getDate() - 7);
    word.lastMistake = today.getTime();
    word.difficulty = 1;
    word.upgradeDifficulty();
    expect(word.difficulty).toBe(2);
  });

  test('difficulty should not be upgraded', () => {
    const word = new Word(null, null, {});
    const today = new Date();
    today.setDate(today.getDate() - 6);
    word.lastMistake = today.getTime();
    word.difficulty = 1;
    word.upgradeDifficulty();
    expect(word.difficulty).toBe(1);
  });

  test('mistake should be update', () => {
    const word = new Word(null, null, {});
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    word.totalMistakes = 0;
    word.setMistake();
    expect(word.totalMistakes).toBe(1);
    const testDate = new Date(word.lastMistake);
    testDate.setHours(0, 0, 0, 0);
    expect(testDate.getTime()).toBe(today.getTime());
  });
});

describe('upgrade phase:', () => {
  test('should upgrade phase', () => {
    const word = new Word(null, null, {});
    word.repetitionPhase = 0;
    word.upgradePhase();
    expect(word.repetitionPhase).toBe(1);
  });
  test('shouldnt upgrade phase', () => {
    const word = new Word(null, null, {});
    const lastPhase = parameters.phase.length - 1;
    word.repetitionPhase = lastPhase;
    word.upgradePhase();
    expect(word.repetitionPhase).toBe(lastPhase);
  });
});

describe('get next phase:', () => {
  test('should get next phase', () => {
    const word = new Word(null, null, {});
    word.repetitionPhase = 0;
    expect(word.getNextPhase()).toBe(
      parameters.phase[word.repetitionPhase + 1],
    );
  });
  test('shouldnt get next phase', () => {
    const word = new Word(null, null, {});
    const lastPhase = parameters.phase.length - 1;
    word.repetitionPhase = lastPhase;
    expect(word.getNextPhase()).toBe(parameters.phase[word.repetitionPhase]);
  });
});

describe('get new phases:', () => {
  test('should return 4 phases for new word', () => {
    const word = new Word(null, null, {});
    expect(word.getNewPhases()).toHaveLength(4);
  });
});

describe('set difficulty:', () => {
  test('should set difficulty', () => {
    const word = new Word(null, null, {});
    const difficulty = 1;
    word.setDifficulty(difficulty);
    expect(word.difficulty).toBe(1);
  });
});

// describe('get next repetition', () => {
//   test('should get next repetition', () => {
//     WordQueue.mockImplementationOnce(() => (
//       {
//         queue: [1, 2, 3],
//       }
//     ));
//     const WordQueue = new WordQueue([], [], 1, 0);
//     const word1 = new Word(WordQueue, null, {});
//     console.log(word1.getNextRepetition());
//   });
// });
