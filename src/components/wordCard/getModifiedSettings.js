export default function getModifiedSettings(settings) {
  const result = {};

  const modifier = [
    ['isImageShow', 'Show image'],
    ['isTranscriptionShow', 'Show transcript'],
    ['isWordTranslateShow', 'Word translation'],
    ['isTextExampleShow', 'Example sentence'],
    ['isTextMeaningShow', 'Definition sentence'],
    ['isTranslateShow', 'Show translation'],
    ['isShowAnswerBtn', 'Show answer'],
    ['isDeleteBtn', 'Delete card'],
    ['isComplexityBtn', 'Categories of words'],
    ['isAudioAuto', 'Sound'],
  ];

  const settingsArr = [];
  settings.forEach((section) => {
    settingsArr.push(...section.settingsArr);
  });

  settingsArr.forEach((setting) => {
    const filtered = modifier.filter((settingItem) => settingItem[1] === setting.name);

    if (filtered.length === 1) {
      result[filtered[0][0]] = setting.isChecked;
    }
  });

  return result;
}
