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
    if ((wordForEqual !== item.translation.text.trim())
    && word.partOfSpeechAbbreviation === item.partOfSpeechAbbreviation) {
      result.add(item.translation.text);
    }
  });
  return result;
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
          const needWordsCount = VERSIONSCOUNT - (filteredMeanings.size + 1);
          if (needWordsCount > 0) {
            const alternatives = [...d[0].alternativeTranslations];
            while (filteredMeanings.size < 4) {
              filteredMeanings.add(alternatives.shift().translation.text);
            }
            // versions = [...filteredMeanings, ...d[0].alternativeTranslations.splice(0, needWordsCount)];
            versions = [...Array.from(filteredMeanings)];
          } else if (needWordsCount === 0) {
            versions = Array.from(filteredMeanings);
          } else {
            versions = [...Array.from(filteredMeanings).splice(0, VERSIONSCOUNT - 1)];
          }
          const vers = Array.from(versions).map((item) => ({
            translation: {
              text: item,
            },
          }));
          return getRenderData([wordObj, ...vers]);
        });
    });
};

export default getWordVersions;
