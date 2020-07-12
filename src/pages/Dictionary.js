import React, { useState, useEffect } from 'react';
import Tabs from '../components/tabs/Tabs';
import TabContent from '../components/tabs/tabContent/TabContent';
import { getAllUserWords } from '../controllers/words/userWords';
import { getWordsById } from '../controllers/words/words';
import { getCookie } from '../utils/cookie';
import Button from '../components/button/Button';

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
  useEffect(() => {
    const auth = JSON.parse(getCookie('auth'));
    const getDictionaryWords = async (token, id) => {
      const response = await getAllUserWords(token, id);
      if (response.notification.status) {
        setDictionaryWords(response.data);
      } else {
        console.log('something wrongs');
      }
    };
    getDictionaryWords(auth.token, auth.userId);
  }, []);

  useEffect(() => {
    const getElementsDictionaryFromId = async () => {
      const list = [];
      dictionaryWords.forEach((w) => {
        list.push(getWordsById(w.wordId));
      });
      Promise.all(list).then((resps) => {
        setDictionaryInfoWords(resps);
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
          const { isDeleted } = d.optional;
          if (isDeleted !== undefined && isDeleted) {
            tabContentLocal.deleted.push(word);
          } else if (d.difficulty === 'normal') {
            tabContentLocal.normal.push(word);
          } else {
            tabContentLocal.hard.push(word);
          }
        }
      });
      setTabContent(tabContentLocal);
    }
  }, [dictionaryInfoWords, dictionaryWords]);

  const buildTab = (cTab) => {
    const tab = [];
    tabContent[cTab].forEach((w) => {
      const cWord = w[0].data;
      tab.push({
        id: cWord.id, origin: cWord.word, transcript: cWord.transcription, translation: cWord.wordTranslate,
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

  return (
    <div>
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
