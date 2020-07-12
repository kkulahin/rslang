import React, { useState, useEffect } from 'react';
import Tabs from '../../components/tabs/Tabs';
import TabContent from '../../components/tabs/tabContent/TabContent';
import { getAllUserWords } from '../../controllers/words/userWords';
import { getWordsById } from '../../controllers/words/words';
import Button from '../../components/button/Button';
import './Dictionary.scss';
import { getTodaySeconds, getDateFromSeconds, checkDayDifferenceAbs } from '../../utils/time';

const isEmptyArr = (arr) => {
  if (Array.isArray(arr) && !arr.length) {
    return true;
  }
  return false;
};

const Dictionary = () => {
  const [dictionaryWords, setDictionaryWords] = useState(null);
  const [dictionaryInfoWords, setDictionaryInfoWords] = useState(null);
  const [tabContent, setTabContent] = useState({ normal: [], hard: [], deleted: [] });
  const [isUpdated, setUpdate] = useState(false);
  const [tabContentUpdated, setTabContentUpdated] = useState(null);
  const [isRender, setRenderPage] = useState(false);
  useEffect(() => {
    const getDictionaryWords = async () => {
      const { data, response } = await getAllUserWords();
      if (response.ok) {
        setDictionaryWords(data);
      }
    };
    getDictionaryWords();
  }, []);

  useEffect(() => {
    const getElementsDictionaryFromId = async () => {
      const list = [];
      dictionaryWords.forEach((w) => {
        list.push(getWordsById(w.wordId));
      });
      Promise.all(list).then((resps) => {
        setDictionaryInfoWords(resps);
        setRenderPage(true);
      });
    };
    if (dictionaryWords !== null) {
      getElementsDictionaryFromId();
    }
  }, [dictionaryWords]);

  useEffect(() => {
    if (dictionaryInfoWords !== null) {
      const tabContentLocal = {
        normal: [],
        hard: [],
        deleted: [],
      };
      dictionaryWords.forEach((d) => {
        const word = dictionaryInfoWords.filter((w) => w.data.id === d.wordId);
        if (word !== null) {
          const {
            isDeleted,
            totalMistakes,
            totalRepetition,
            nextRepetition,
          } = d.optional;
          const [oneWord] = word;

          const today = getDateFromSeconds(getTodaySeconds());
          const repetition = getDateFromSeconds(nextRepetition);

          if (repetition - today <= 0) {
            oneWord.data.nextRepetition = 'today or soon';
          } else if (checkDayDifferenceAbs(today, repetition) === 1) {
            oneWord.data.nextRepetition = 'tomorrow or soon';
          } else {
            oneWord.data.nextRepetition = `${repetition.getFullYear()}-${repetition.getMonth() + 1}-${repetition.getDate()}`;
          }

          oneWord.data.totalMistakes = totalMistakes;
          oneWord.data.totalRepetition = totalRepetition;
          if (isDeleted !== undefined && isDeleted) {
            tabContentLocal.deleted.push(oneWord.data);
          } else if (d.difficulty === 'normal') {
            tabContentLocal.normal.push(oneWord.data);
          } else {
            tabContentLocal.hard.push(oneWord.data);
          }
        }
      });
      setTabContent(tabContentLocal);
    }
  }, [dictionaryInfoWords, dictionaryWords]);

  const buildTab = (cTab) => {
    const tab = [];
    tabContent[cTab].forEach((w) => {
      tab.push({
        id: w.id,
        origin: w.word,
        transcript: w.transcription,
        translation: w.wordTranslate,
        totalRepetition: w.totalRepetition,
        totalMistakes: w.totalMistakes,
        nextRepetition: w.nextRepetition,
      });
    });
    return tab;
  };

  const isUpdateButtonActive = (status) => {
    setUpdate(status);
  };

  const getNewWordList = (words) => {
    if (tabContentUpdated === null) {
      setUpdate(false);
    }
    if (JSON.stringify(tabContentUpdated) !== JSON.stringify(words)) {
      setTabContentUpdated(words);
    }
  };

  const saveChange = () => {
    const { deletedWords } = tabContentUpdated;
    const newDictionaryWords = JSON.parse(JSON.stringify(dictionaryWords));
    deletedWords.forEach((w) => {
      const wordsIdx = dictionaryWords.findIndex((e) => e.wordId === w.id);
      let statusWords = newDictionaryWords[wordsIdx].optional.isDeleted;
      statusWords = statusWords === undefined ? true : !statusWords;
      newDictionaryWords[wordsIdx].optional.isDeleted = statusWords;
    });
    setTabContentUpdated(null);

    setDictionaryWords(newDictionaryWords);
  };

  if (!isRender) {
    return (
      <div className="spinner">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }
  return (

    <div className="dictionary">
      <Tabs>
        <div label="All">
          {
isEmptyArr(tabContent.normal)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('normal')}
      getWordList={getNewWordList}
    />
  )
}

        </div>
        <div label="Hard">
          {
isEmptyArr(tabContent.hard)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('hard')}
      getWordList={getNewWordList}
    />
  )
}
        </div>
        <div label="Deleted">
          {
isEmptyArr(tabContent.deleted)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('deleted')}
      getWordList={getNewWordList}
    />
  )
}
        </div>
      </Tabs>
      {
!isUpdated ? null : (
  <Button
    id="dictionary-save"
    label="update"
    clickHandler={saveChange}
  />
)
}

    </div>
  );
};

export default Dictionary;
