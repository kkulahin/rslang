const VERSIONSCOUNT = 5;
const getRenderData = (arr) => {
  const currentWordNumber = Math.floor(Math.random() * 4) + 1;
  if (currentWordNumber === 0) { return [currentWordNumber, arr]; }
  const words = [];
  for (let i = 1, j = 0; j < arr.length; j += 1) {
    if (currentWordNumber === j) {
      words.push(arr[0]);
    } else {
      words.push(arr[i]);
      i += 1;
    }
  }
  return {
    currentWordNumber, words,
  };
};

const filterWordsWithSimilarTranslition = (arr, wordForEqual) => {
  const word = arr[0];
  const result = new Set();
  arr.forEach((item) => {
    if ((wordForEqual !== item.translation.text)
    && word.partOfSpeechAbbreviation === item.partOfSpeechAbbreviation) {
      result.add(item.translation.text);
    }
  });
  return Array.from(result).map((item) => ({
    translation: {
      text: item,
    },
  }));
};

const getWordVersions = async (wordObj) => {
  const { word } = wordObj;
  let versions = [];
  let id = null;
  return fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word}&pageSize=1`)
    .then((res) => res.json())
    .then((data) => {
      id = data[0].meanings[0].id;
      return fetch(`https://dictionary.skyeng.ru/api/public/v1/meanings?ids=${id}`)
        .then((res) => res.json())
        .then((d) => {
          const filteredMeanings = filterWordsWithSimilarTranslition(
            [...d[0].meaningsWithSimilarTranslation], wordObj.wordTranslate,
          );
          const needWordsCount = VERSIONSCOUNT - (filteredMeanings.length + 1);
          if (needWordsCount > 0) {
            versions = [...filteredMeanings, ...d[0].alternativeTranslations.splice(0, needWordsCount)];
          } else {
            versions = filteredMeanings;
          }
          return getRenderData([wordObj, ...versions]);
        });
    });
};

export default getWordVersions;
