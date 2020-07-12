export default class WordDefinition {
  /**
   * @param {*} param word definition {
   * @param {string} param._id: '5e9f5ee35eb9e72bc21af4a1',
   * @param {number} param.group: 0,
   * @param {number} param.page: 0,
   * @param {string} param.word: 'agree',
   * @param {string} param.image: 'files/01_0001.jpg',
   * @param {string} param.audio: 'files/01_0001.mp3',
   * @param {string} param.audioMeaning: 'files/01_0001_meaning.mp3',
   * @param {string} param.audioExample: 'files/01_0001_example.mp3',
   * @param {string} param.textMeaning: 'To <i>agree</i> is to have the same opinion or belief as another person.',
   * @param {string} param.textExample: 'The students <b>agree</b> they have too much homework.',
   * @param {string} param.transcription: '[əgríː]',
   * @param {string} param.textExampleTranslate: 'Студенты согласны, что у них слишком много домашней работы',
   * @param {string} param.textMeaningTranslate: 'Согласиться - значит иметь то же мнение или ...
   * @param {string} param.wordTranslate: 'согласна',
   * @param {string} param.wordsPerExampleSentence: 8,
   */
  constructor(param) {
    Object.keys(param).forEach((key) => {
      if (key === '_id') {
        this.wordId = param[key];
      } else if (key !== 'userWord') {
        this[key] = param[key];
      }
    });
  }
}
