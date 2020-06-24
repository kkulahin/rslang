export default class WordDefinition {
  /**
   * @param {*} param word definition
   */
  constructor({
    word, translation, example, exampleTranslation, image, sound, transcription, _id,
  }) {
    this.word = word;
    this.translation = translation;
    this.example = example;
    this.exampleTranslation = exampleTranslation;
    this.image = image;
    this.sound = sound;
    this.transcription = transcription;
    this.wordId = _id;
  }
}
