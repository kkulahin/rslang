import WordController from "../../src/utils/spacedRepetition/WordController";
import Word from "../../src/utils/spacedRepetition/Word";
import parameters from "../../src/utils/spacedRepetition/parameters";

jest.mock("../../src/utils/spacedRepetition/Word");

beforeEach(() => {
	Word.mockClear();
});

describe("create queue", () => {
	describe("static methods", () => {
		test("should add to the queue once", () => {
			Word.mockImplementationOnce(() => {
				return {
					getNextEducationTime: () => [0],
					getNextRepetitionTime: () => undefined,
				};
			});
			const word = new Word(null, null, {});
			const queue = [];
			WordController.addToQueueIfNeeded(word, queue);
			expect(queue.length).toBe(1);
		});
		test("should add to the queue 4 times", () => {
			Word.mockImplementationOnce(() => {
				return {
					getNextEducationTime: () => [0, 7, 19, 36],
					getNextRepetitionTime: () => undefined,
				};
			});
			const word = new Word(null, null, {});
			const queue = [];
			WordController.addToQueueIfNeeded(word, queue);
			expect(queue.length).toBe(4);
		});
		test("should add to the queue 5 times", () => {
			Word.mockImplementationOnce(() => {
				return {
					getNextEducationTime: () => [0, 7, 19, 36],
					getNextRepetitionTime: () => 5,
				};
			});
			const word = new Word(null, null, {});
			const queue = [];
			WordController.addToQueueIfNeeded(word, queue);
			expect(queue.length).toBe(5);
			expect(queue.filter((qWord) => qWord.isEducation === true).length).toBe(
				4
			);
			expect(queue.filter((qWord) => qWord.isEducation === false).length).toBe(
				1
			);
		});
		test("should not to be added to the queue", () => {
			Word.mockImplementationOnce(() => {
				return {
					getNextEducationTime: () => [],
					getNextRepetitionTime: () => undefined,
				};
			});
			const word = new Word(null, null, {});
			const queue = [];
			WordController.addToQueueIfNeeded(word, queue);
			expect(queue.length).toBe(0);
		});
		test("should fill queue", () => {
			Word.mockImplementationOnce(() => {
				return {
					getNextEducationTime: () => [0],
					getNextRepetitionTime: () => undefined,
				};
			});
			Word.mockImplementationOnce(() => {
				return {
					getNextEducationTime: () => [],
					getNextRepetitionTime: () => 1,
				};
			});
			const word = new Word(null, null, {});
			const word2 = new Word(null, null, {});
			const queue = [];
			WordController.fillQueue([word, word2], queue);
			expect(queue.length).toBe(2);
		});
	});
	describe("methods", () => {
		test("mark word as completed", () => {
            const wController = new WordController({});
            const setTimeSpy = jest.fn(() => undefined);
			Word.mockImplementationOnce(() => {
				return {
					setTime: setTimeSpy,
				};
			});
            const word = new Word(wController, null, {});
            wController.queue.push({word});
            wController.changeWord();
            expect(setTimeSpy).toHaveBeenCalledTimes(1);
            expect(wController.queue.length).toBe(0);
		});
		test("mark word as mistaken", () => {
            const wController = new WordController({});
            const setTimeSpy = jest.fn(() => undefined);
            const setMistakeSpy = jest.fn(() => undefined);
			Word.mockImplementationOnce(() => {
				return {
					setTime: setTimeSpy,
					setMistake: setMistakeSpy,
				};
			});
            const word = new Word(wController, null, {});
            wController.queue.push({word});
            wController.queueLength = 1;
            wController.setWordMistaken();
            expect(setMistakeSpy).toHaveBeenCalledTimes(1);
            expect(setTimeSpy).toHaveBeenCalledTimes(1);
            expect(wController.queue.length).toBe(1);
            expect(wController.getLength()).toBe(2);
		});
		test("next word should be undefined when queue is empty", () => {
            const wController = new WordController({});
            expect(wController.getNextWord()).toBe(undefined);
		});
		test("next word should be {word: Word} when queue is not empty", () => {
            const wController = new WordController({});
            const word = new Word(wController, null, {});
            wController.queue.push({word});
            expect(wController.getNextWord().word instanceof Word).toBeTruthy();
        });
        test("only top N words should be filtered", () => {
            const wController = new WordController({settings: {MAX_WORDS: 10, MAX_NEW_WORDS: 5}});
            const words =  [];
            for(let i=0; i<10; i++) {
                words.push(new Word(wController, null, {}));
            }
            const queue = [];
            words.forEach((word, index) => queue.push({word, nextTime: index * 10}));
            words.forEach((word, index) => index % 2 === 0 && queue.push({word, nextTime: index * 5 + 20 }));
            wController.filterUserWordsByCount(queue);
            expect(wController.words.length).toBe(5);
            expect(wController.queue.length).toBe(8);
        });
	});
	describe("new queue", () => {
		test("should be empty", () => {
			const wController = new WordController({});
			expect(wController.getWordsToSave().length).toBe(0);
			expect(wController.getQueueToSave().length).toBe(0);
			expect(wController.getLength()).toBe(0);
			expect(wController.getCurrentLength()).toBe(0);
		});
		test("should be filled", () => {
            const wController = new WordController({settings: {MAX_WORDS: 10, MAX_NEW_WORDS: 5}});
            const newWords = [];
            const userWords = [];
            for(let i=0; i< 10; i++){
                newWords.push({word: 'new'});
                userWords.push({word: 'user'});
                Word.mockImplementationOnce(() => {
                    return {
                        getNextEducationTime: () => [],
                        getNextRepetitionTime: () => 1,
                    };
                });
            }
            Word.mockImplementation(() => {
                return {
                    getNextEducationTime: () => [0],
                    getNextRepetitionTime: () => undefined,
                };
            });
            wController.makeQueue(newWords,userWords);
            expect(wController.queue.length).toBe(10);
            expect(wController.words.length).toBe(10);
            expect(wController.queue.filter((qWord) => qWord.nextTime === 0).length).toBe(5);
            expect(wController.getLength()).toBe(10);
            expect(wController.getCurrentLength()).toBe(10);
		});
	});
});

describe("use predefined queue", () => {
    test("queue should be filled", () => {
        const wController = new WordController({settings: {MAX_WORDS: 10, MAX_NEW_WORDS: 5}});
        const words = [];
        const queue = [];
        for(let i=0; i< 10; i++){
            words.push({wordId: i});
            queue.push({id: i, isEd: false});
            queue.unshift({id: i, isEd: false});
        }
        wController.usePredefinedQueue({queue, length: 30}, words);
        expect(wController.getLength()).toBe(30);
        expect(wController.getCurrentLength()).toBe(20);
        expect(wController.words.length).toBe(10);
    });
});