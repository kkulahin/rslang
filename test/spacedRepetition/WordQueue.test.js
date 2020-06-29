import WordQueue from '../../src/utils/spacedRepetition/WordQueue';
import Word from '../../src/utils/spacedRepetition/Word';

jest.mock('../../src/utils/spacedRepetition/Word');

beforeEach(() => {
  Word.mockClear();
});

describe('static methods', () => {
  test('should add to the queue once', () => {
    Word.mockImplementationOnce(() => ({
      getNextEducationTime: () => [0],
      getNextRepetitionTime: () => undefined,
    }));
    const word = new Word(null, null, {});
    const queue = [];
    WordQueue.addToQueueIfNeeded(word, queue);
    expect(queue.length).toBe(1);
  });
  test('should add to the queue 4 times', () => {
    Word.mockImplementationOnce(() => ({
      getNextEducationTime: () => [0, 7, 19, 36],
      getNextRepetitionTime: () => undefined,
    }));
    const word = new Word(null, null, {});
    const queue = [];
    WordQueue.addToQueueIfNeeded(word, queue);
    expect(queue.length).toBe(4);
  });
  test('should add to the queue 5 times', () => {
    Word.mockImplementationOnce(() => ({
      getNextEducationTime: () => [0, 7, 19, 36],
      getNextRepetitionTime: () => 5,
    }));
    const word = new Word(null, null, {});
    const queue = [];
    WordQueue.addToQueueIfNeeded(word, queue);
    expect(queue.length).toBe(5);
    expect(queue.filter((qWord) => qWord.isEducation === true).length).toBe(
      4,
    );
    expect(queue.filter((qWord) => qWord.isEducation === false).length).toBe(
      1,
    );
  });
  test('should not to be added to the queue', () => {
    Word.mockImplementationOnce(() => ({
      getNextEducationTime: () => [],
      getNextRepetitionTime: () => undefined,
    }));
    const word = new Word(null, null, {});
    const queue = [];
    WordQueue.addToQueueIfNeeded(word, queue);
    expect(queue.length).toBe(0);
  });
  test('should fill queue', () => {
    Word.mockImplementationOnce(() => ({
      getNextEducationTime: () => [0],
      getNextRepetitionTime: () => undefined,
    }));
    Word.mockImplementationOnce(() => ({
      getNextEducationTime: () => [],
      getNextRepetitionTime: () => 1,
    }));
    const word = new Word(null, null, {});
    const word2 = new Word(null, null, {});
    const queue = [];
    WordQueue.fillQueue([word, word2], queue);
    expect(queue.length).toBe(2);
  });
});
describe('methods', () => {
  test('mark word as completed', () => {
    const wQueue = new WordQueue({});
    const word = new Word(wQueue, null, {});
    wQueue.queue.push({ word });
    wQueue.changeWord();
    expect(wQueue.getCurrentLength()).toBe(0);
  });
  test('mark word as mistaken', () => {
    const wQueue = new WordQueue({});
    const setMistakeSpy = jest.fn(() => undefined);
    Word.mockImplementationOnce(() => ({
      setMistake: setMistakeSpy,
    }));
    const word = new Word(wQueue, null, {});
    wQueue.queue.push({ word });
    wQueue.setWordMistaken();
    wQueue.changeWord();
    expect(setMistakeSpy).toHaveBeenCalledTimes(1);
    expect(wQueue.getCurrentLength()).toBe(1);
    expect(wQueue.getLength()).toBe(2);
  });
  test('next word should be undefined when queue is empty', () => {
    const wQueue = new WordQueue({});
    expect(wQueue.getCurrentWord()).toBe(undefined);
  });
  test('next word should be {word: Word} when queue is not empty', () => {
    const wQueue = new WordQueue({});
    const word = new Word(wQueue, null, {});
    wQueue.queue.push({ word });
    expect(wQueue.getCurrentWord().word instanceof Word).toBeTruthy();
  });
  test('only top N words should be filtered', () => {
    const wQueue = new WordQueue({ MAX_WORDS: 10, MAX_NEW_WORDS: 5 });
    const words = [];
    for (let i = 0; i < 10; i += 1) {
      words.push(new Word(wQueue, null, {}));
    }
    const queue = [];
    words.forEach((word, index) => queue.push({ word, nextTime: index * 10 }));
    words.forEach((word, index) => index % 2 === 0 && queue.push({ word, nextTime: index * 5 + 20 }));
    wQueue.filterUserWordsByCount(queue);
    expect(wQueue.words.length).toBe(5);
    expect(wQueue.queue.length).toBe(8);
  });
});
describe('new queue', () => {
  test('should be empty', () => {
    const wQueue = new WordQueue({});
    expect(wQueue.getWords().length).toBe(0);
    expect(wQueue.getQueueToSave().queue.length).toBe(0);
    expect(wQueue.getLength()).toBe(0);
    expect(wQueue.getCurrentLength()).toBe(0);
  });
  test('should be filled', () => {
    const wQueue = new WordQueue({ MAX_WORDS: 10, MAX_NEW_WORDS: 5 });
    const newWords = [];
    const userWords = [];
    for (let i = 0; i < 10; i += 1) {
      newWords.push({ word: 'new' });
      userWords.push({ word: 'user' });
      Word.mockImplementationOnce(() => ({
        getNextEducationTime: () => [],
        getNextRepetitionTime: () => 1,
        shiftMistakes: () => {},
      }));
    }
    Word.mockImplementation(() => ({
      getNextEducationTime: () => [0],
      getNextRepetitionTime: () => undefined,
      shiftMistakes: () => {},
    }));
    wQueue.makeQueue(newWords, userWords);
    expect(wQueue.queue.length).toBe(10);
    expect(wQueue.words.length).toBe(10);
    expect(wQueue.queue.filter((qWord) => qWord.nextTime === 0).length).toBe(5);
    expect(wQueue.getLength()).toBe(10);
    expect(wQueue.getCurrentLength()).toBe(10);
  });
});

describe('use predefined queue', () => {
  test('queue should be filled', () => {
    const wQueue = new WordQueue({ MAX_WORDS: 10, MAX_NEW_WORDS: 5 });
    const words = [];
    const queue = [];
    for (let i = 0; i < 10; i += 1) {
      words.push({ wordId: i });
      queue.push({ id: i, isEd: false });
      queue.unshift({ id: i, isEd: false });
      queue.unshift({ id: i, isEd: false });
    }
    wQueue.usePredefinedQueue({ queue, pointer: 10 }, words);
    expect(wQueue.getLength()).toBe(30);
    expect(wQueue.getCurrentLength()).toBe(20);
    expect(wQueue.words.length).toBe(10);
  });
});
