import React, { useState, useEffect } from 'react';
import { Modal } from 'semantic-ui-react';
import Tabs from '../../components/tabs/Tabs';
import TabContent from '../../components/tabs/tabContent/TabContent';
import DictionaryWordCard from '../../components/dictionaryWordCard/DictionaryWordCard';
import PageSpinner from '../../components/pageSpinner/PageSpinner';
import getModifiedSettings from '../../components/wordCard/getModifiedSettings';
import { getAllUserWords } from '../../controllers/words/userWords';
import { getWordsById } from '../../controllers/words/words';
import Button from '../../components/wordCard/button/Button';
import ButtonDefault from '../../components/button/Button';
import { getTodaySeconds, getDateFromSeconds, checkDayDifferenceAbs } from '../../utils/time';
import WordController from '../../controllers/WordConrtoller';
import settingsController from '../../controllers/SettingsController';
import settingsSubject from '../../utils/observers/SettingSubject';
import './Dictionary.scss';
import parameters from '../../utils/spacedRepetition/parameters';

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
  const [settings, setSettings] = useState(settingsController.get());

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
            time,
          } = d.optional;
          const [oneWord] = word;

          const today = getDateFromSeconds(getTodaySeconds());
          const repetition = getDateFromSeconds(nextRepetition);
          const lastRepetition = getDateFromSeconds(time);

          if (isDeleted) {
            oneWord.data.nextRepetition = 'never';
          } else if (repetition - today <= 0) {
            oneWord.data.nextRepetition = 'today or soon';
          } else if (checkDayDifferenceAbs(today, repetition) === 1) {
            oneWord.data.nextRepetition = 'tomorrow or soon';
          } else {
            oneWord.data.nextRepetition = `${repetition.getFullYear()}-${repetition.getMonth() + 1}-${repetition.getDate()}`;
          }

          if (checkDayDifferenceAbs(lastRepetition, today) === 0) {
            oneWord.data.lastRepetition = 'today';
          } else if (checkDayDifferenceAbs(lastRepetition, today) === 1) {
            oneWord.data.lastRepetition = 'yesterday';
          } else {
            oneWord.data.lastRepetition = `${lastRepetition.getFullYear()}-${lastRepetition.getMonth() + 1}-${lastRepetition.getDate()}`;
          }

          oneWord.data.totalMistakes = totalMistakes;
          oneWord.data.totalRepetition = totalRepetition;
          if (isDeleted !== undefined && isDeleted) {
            tabContentLocal.deleted.push(oneWord.data);
          } else if (d.difficulty !== parameters.difficultyNames.hard) {
            tabContentLocal.normal.push(oneWord.data);
          } else {
            tabContentLocal.hard.push(oneWord.data);
          }
        }
      });
      setTabContent(tabContentLocal);
    }
  }, [dictionaryInfoWords, dictionaryWords]);

  useEffect(() => {
    settingsSubject.subscribe(setSettings);
    return () => {
      settingsSubject.unsubscribe(setSettings);
    };
  }, [setSettings]);

  let cardSettings;
  if (settings) {
    cardSettings = getModifiedSettings(settings);
  }

  const buildTab = (cTab) => {
    const tab = [];
    tabContent[cTab].forEach((w) => {
      tab.push({
        id: w.id,
        origin: w.word,
        transcript: w.transcription,
        translation: w.wordTranslate,
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

  if (!isRender) {
    return (
      <div className="dictionary-spinner-container">
        <PageSpinner />
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
            <ButtonDefault
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
          {`${isOpenModal.wordInfo?.word}`}
        </Modal.Header>
        <Modal.Content>
          <DictionaryWordCard
            settings={cardSettings}
            word={isOpenModal.wordInfo}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            id="modal-close"
            label="Close"
            clickHandler={closeModal}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Dictionary;
