import Word from '../../src/utils/spacedRepetition/Word';
import parameters from '../../src/utils/spacedRepetition/parameters';

describe('change difficulty', () => {
  test('last mistake should be 1 day ago', () => {
    const word = new Word(null, null, {});
    const today = new Date();
    today.setDate(today.getDate() - 7);
    word.lastMistake = today.getTime();
    expect(word.getWhenWasLastMistake()).toBe(7);
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
