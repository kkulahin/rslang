import WordModel from '../../src/utils/spacedRepetition/WordModel';
import WordDefinition from '../../src/utils/spacedRepetition/WordDefinition';
import Word from '../../src/utils/spacedRepetition/Word';

const testUser = {
  id: '5ef2f7af6ab47000177e3cf1',
  email: 'test_group51@gmail.com',
  password: 'Qpalsk5&1',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZjJmN2FmNmFiNDcwMDAxNzdlM2NmMSIsImlhdCI6MTU5MzAxOTkzMywiZXhwIjoxNTkzMDM0MzMzfQ.7LgUCPXop3eGLIPjgMGOg8an4KZTjZjgaJDF_7umCfk',
};

const testSettings = {
  MAX_WORDS: 10,
  MAX_NEW_WORDS: 3,
};

describe('test sync methods', () => {
  test('make simple get request', () => {
    const wModel = new WordModel(testUser, testSettings);
    const { url, options } = wModel.makeRequest('GET', 'user');
    expect(url.toString().includes(testUser.id)).toBeTruthy();
    expect(options.headers.Authorization).toEqual(`Bearer ${testUser.token}`);
    expect(options.method).toEqual('GET');
  });
  test('make POST request with body', () => {
    const wModel = new WordModel(testUser, testSettings);
    const body = { message: 'some text' };
    const { url, options } = wModel.makeRequest('POST', 'user', body);
    expect(url.toString().includes('?')).toBeFalsy();
    expect(options.body === JSON.stringify(body));
  });
  test('make GET request with params', () => {
    const wModel = new WordModel(testUser, testSettings);
    const params = { a: '1 1%$', b: 2 };
    const { url } = wModel.makeRequest('GET', 'user', null, params);
    expect(url.toString().includes('?a=1+1%25%24&b=2')).toBeTruthy();
  });
});

describe('test async methods', () => {
  test('update statistics', async () => {
    const wModel = new WordModel(testUser, testSettings);
    wModel.statistics = { learnedWords: 0, optional: {} };
    const data = await wModel.updateStatistics();
    expect(data.learnedWords).toBe(wModel.statistics.learnedWords);
  });
  test('get statistics', async () => {
    const wModel = new WordModel(testUser, testSettings);
    await wModel.getStatistics();
    expect(wModel.statistics).toBeTruthy();
  });
  test('get new words', async () => {
    const wModel = new WordModel(testUser, testSettings);
    const data = await wModel.gueryNewWords();
    expect(data.length).toBe(3);
  });
  test('get new words', async () => {
    const wModel = new WordModel(testUser, testSettings);
    const data = await wModel.queryUserWords();
    expect(data.length < 8).toBeTruthy();
  });
  test('put word', async () => {
    const rawWord = {
      _id: '5e9f5ee35eb9e72bc21af4a1',
      group: 0,
      page: 0,
      word: 'agree',
      image: 'files/01_0001.jpg',
      audio: 'files/01_0001.mp3',
      audioMeaning: 'files/01_0001_meaning.mp3',
      audioExample: 'files/01_0001_example.mp3',
      textMeaning: 'To <i>agree</i> is to have the same opinion or belief as another person.',
      textExample: 'The students <b>agree</b> they have too much homework.',
      transcription: '[əgríː]',
      textExampleTranslate: 'Студенты согласны, что у них слишком много домашней работы',
      textMeaningTranslate: 'Согласиться - значит иметь то же мнение или убеждение, что и другой человек',
      wordTranslate: 'согласна',
      wordsPerExampleSentence: 8,
    };
    const wordDef = new WordDefinition(rawWord);
    const word = new Word(null, wordDef, {});
    const wModel = new WordModel(testUser, testSettings);
    const data = await wModel.updateWord(word);
    // eslint-disable-next-line no-underscore-dangle
    expect(data.wordId).toBe(rawWord._id);
  });
});
