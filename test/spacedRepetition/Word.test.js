import Word from '../../src/utils/spacedRepetition/Word';
import parameters from '../../src/utils/spacedRepetition/parameters';

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
});
