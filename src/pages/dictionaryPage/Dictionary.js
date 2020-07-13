import React, { useState, useEffect, useRef } from 'react';
import {
  Button as SemanticButton, Header, Image, Modal,
} from 'semantic-ui-react';
import Tabs from '../../components/tabs/Tabs';
import TabContent from '../../components/tabs/tabContent/TabContent';
import { getAllUserWords } from '../../controllers/words/userWords';
import { getWordsById } from '../../controllers/words/words';
import Button from '../../components/button/Button';
import { getTodaySeconds, getDateFromSeconds, checkDayDifferenceAbs } from '../../utils/time';
import WordController from '../../controllers/WordConrtoller';

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
  const [activeTab, setActiveTab] = useState({ cTab: null, updated: false });
  const [isRemove, setRemoveWords] = useState(false);
  const [isOpenModal, setStatusModal] = useState({
    open: false, dimmer: 'blurring', word: null, wordInfo: null,
  });

  const cardWord = useRef(null);
  const cardExample = useRef(null);

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

  const getActiveTab = (tab) => {
    if (activeTab.cTab === null || activeTab.cTab !== tab) {
      const cTab = {
        updated: false,
        cTab: tab,
      };
      setActiveTab(cTab);
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
    const cTab = {
      updated: true,
      cTab: activeTab.cTab,
    };
    setActiveTab(cTab);
    setDictionaryWords(newDictionaryWords);
    setRemoveWords(true);
  };

  const getStatusRemove = (removedWords) => {
    if (isEmptyArr(removedWords)) {
      return false;
    }

    setRemoveWords(false);
    const updatedWords = [];
    removedWords.forEach((w) => {
      for (let i = 0; i < dictionaryWords.length; i += 1) {
        if (dictionaryWords[i].wordId === w.id) {
          updatedWords.push(dictionaryWords[i]);
          break;
        }
      }
    });
    if (!isEmptyArr(updatedWords)) {
      updatedWords.forEach((updW) => {
        WordController.updateWord(updW, false);
      });
    }
    return false;
  };

  const closeModal = () => {
    const newStatusModal = {
      open: false,
      dimmer: isOpenModal.dimmer,
      word: null,
      wordInfo: null,
    };
    setStatusModal(newStatusModal);
  };

  const showModal = (cId) => {
    const word = dictionaryWords.filter((w) => w.wordId === cId);
    const wordInfo = dictionaryInfoWords.filter((w) => w.data.id === cId);
    const newStatusModal = {
      open: true,
      dimmer: 'blurring',
      word: word[0],
      wordInfo: wordInfo[0].data,
    };
    setStatusModal(newStatusModal);
  };

  const removeTags = (text) => {
    if (isOpenModal.word !== null && isOpenModal.wordInfo !== null) {
      const re = /(.*)<b>(.*)<\/b>(.*)/;
      const result = re.exec(text);
      return result === null ? null : `${result[1]} ${result[2]} ${result[3]}`;
    }
    return null;
  };

  const playWord = (e) => {
    const el = e.currentTarget;
    const attr = el.getAttribute('name');
    let audio = null;
    // eslint-disable-next-line default-case
    switch (attr) {
      case 'cardWord':
        audio = cardWord.current;
        break;
      case 'cardExample':
        audio = cardExample.current;
        break;
    }
    if (audio !== null) {
      audio.play();
    }
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
    <>
      <div className="dictionary">
        <Tabs getActiveTab={getActiveTab}>
          <div label="All">
            {
isEmptyArr(tabContent.normal)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('normal')}
      getWordList={getNewWordList}
      isRemoveWords={isRemove}
      getStatusRemove={getStatusRemove}
      openModal={showModal}
      closeModal={closeModal}
      isOpenModal={isOpenModal.open}
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
      isRemoveWords={isRemove}
      getStatusRemove={getStatusRemove}
      openModal={showModal}
      closeModal={closeModal}
      isOpenModal={isOpenModal.open}
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
      isRemoveWords={isRemove}
      getStatusRemove={getStatusRemove}
      openModal={showModal}
      closeModal={closeModal}
      isOpenModal={isOpenModal.open}
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
      <Modal
        className="dictionary-modal"
        dimmer={isOpenModal.dimmer}
        open={isOpenModal.open}
        onClose={closeModal}
      >
        <Modal.Header>
          {
`${isOpenModal.wordInfo?.word} ${isOpenModal.wordInfo?.transcription}`
}
        </Modal.Header>
        <Modal.Content image className="modal-content">
          <Image
            wrapped
            size="medium"
            src={`data:image/png;base64, ${isOpenModal.wordInfo?.image}`}
          />
          <Modal.Description>
            <Header>
              <button className="circular ui icon button" name="cardWord" onClick={playWord}>
                <i className="icon play" />
                <audio ref={cardWord} src={`data:audio/mpeg;base64, ${isOpenModal.wordInfo?.audio}`}>
                  <track kind="captions" />
                </audio>
              </button>
              {isOpenModal.wordInfo?.word}
            </Header>
            <p>
              Transcription:
              {isOpenModal.wordInfo?.transcription}
            </p>
            <p>
              Translate:
              {' '}
              {isOpenModal.wordInfo?.wordTranslate}
            </p>
            <p>
              <button className="circular ui icon button" name="cardExample" onClick={playWord}>
                <i className="icon play" />
                <audio ref={cardExample} src={`data:audio/mpeg;base64, ${isOpenModal.wordInfo?.audioExample}`}>
                  <track kind="captions" />
                </audio>
              </button>
              Example:
              {' '}
              { removeTags(isOpenModal.wordInfo?.textExample)}
            </p>
            <p>
              Mistakes:
              {' '}
              {isOpenModal.wordInfo?.totalMistakes}
            </p>
            <p>
              Repetition:
              {' '}
              {isOpenModal.wordInfo?.totalRepetition}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <SemanticButton
            positive
            icon="checkmark"
            labelPosition="right"
            content="Close"
            onClick={closeModal}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Dictionary;
