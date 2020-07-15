/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Pagination } from 'semantic-ui-react';

import './TabContent.scss';

const Row = ({ word, onClickCrashButton, getRowId }) => {
  const {
    id, origin, transcript, translation, totalRepetition, totalMistakes, nextRepetition,
  } = word;

  const setActiveRow = (rowId, e) => {
    if (!e.target.classList.contains('trash')) {
      getRowId(rowId);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className="tab-content__row" data-element={id} onClick={(e) => setActiveRow(id, e)}>
      <div className="tab-content__row__item">
        <span>{origin}</span>
        <div className="tooltip">
          <span>
            Total Repetition:
            {totalRepetition}
          </span>
          <span>
            Total Mistakes:
            {totalMistakes}
          </span>
          <span>
            Next Repetition:
            {nextRepetition}
          </span>
        </div>
      </div>
      <div className="tab-content__row__item">{transcript}</div>
      <div className="tab-content__row__item">{translation}</div>
      <div className="tab-content__row__item">
        <Icon name="trash alternate" className="tab-content__row_crash-icon" onClick={onClickCrashButton} />
      </div>
    </div>
  );
};

Row.propTypes = {
  word: PropTypes.instanceOf(Object).isRequired,
  onClickCrashButton: PropTypes.func.isRequired,
  getRowId: PropTypes.func.isRequired,
};

const TabContent = ({
  wordList,
  getWordList,
  getStatus,
  isRemoveWords,
  getStatusRemove,
  openModal,
  closeModal,
  isOpenModal,
}) => {
  const [words, setWords] = useState(wordList);
  const [deletedWords, setDeletedWords] = useState([]);
  const [controlPagination, setControlPagination] = useState({
    activePage: 1,
    maxPage: Math.ceil(wordList.length / 10),
    rowPerPage: 10,
  });
  const [activeRow, setRow] = useState(null);
  const [firstRenderModal, setRenderModal] = useState(true);

  const getActiveRowId = (id) => {
    setRow(id);
  };

  const rows = words.slice(
    controlPagination.rowPerPage * (controlPagination.activePage - 1),
    controlPagination.rowPerPage * controlPagination.activePage,
  ).map((word, idx) => (
    <Row
      word={word}
      key={word.origin}
      onClickCrashButton={() => {
        const before = words.slice(0, idx);
        const after = words.slice(idx + 1);
        setDeletedWords([...deletedWords, words[idx]]);
        setWords([...before, ...after]);
        getStatus(true);
      }}
      getRowId={getActiveRowId}
    />
  ));
  useEffect(() => {
    if (!isOpenModal) {
      setRow(null);
    }
  }, [isOpenModal]);

  useEffect(() => {
    if (activeRow !== null && !isOpenModal) {
      setRenderModal(false);
      openModal(activeRow);
    }
    if (activeRow === null && !firstRenderModal) {
      setRenderModal(true);
      closeModal();
    }
  }, [activeRow, openModal, isOpenModal, closeModal, firstRenderModal]);

  useEffect(() => {
    getWordList({ words, deletedWords });
    const maxPage = Math.ceil(words.length / 10);
    const newMaxItem = { ...controlPagination, activePage: maxPage === 1 ? 1 : controlPagination.activePage, maxPage };
    setControlPagination(newMaxItem);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWordList, words]);

  useEffect(() => {
    if (isRemoveWords) {
      const cDelWords = deletedWords.splice(0);
      setDeletedWords([]);
      getStatusRemove(cDelWords);
    }
  }, [isRemoveWords, getStatusRemove, deletedWords]);

  const onChangeList = (e, { activePage }) => {
    const newActivePage = { ...controlPagination, activePage };
    setControlPagination(newActivePage);
  };

  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <div className="tab-content__row">
          <div className="tab-content__row__item">Word</div>
          <div className="tab-content__row__item">Transcript</div>
          <div className="tab-content__row__item">Translation</div>
          <div className="tab-content__row__item" />
        </div>
      </div>
      <div className="tab-content__body">
        {rows}
        {
controlPagination.maxPage <= 1 ? null : (
  <Pagination
    className="tab-content__pagination"
    boundaryRange={0}
    defaultActivePage={1}
    ellipsisItem={null}
    firstItem={null}
    lastItem={null}
    siblingRange={1}
    totalPages={controlPagination.maxPage}
    onPageChange={onChangeList}
  />
)
}
      </div>
    </div>
  );
};

TabContent.propTypes = {
  wordList: PropTypes.instanceOf(Array).isRequired,
  getStatus: PropTypes.func,
  getWordList: PropTypes.func,
  isRemoveWords: PropTypes.bool,
  getStatusRemove: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isOpenModal: PropTypes.bool,
};

TabContent.defaultProps = {
  getStatus: () => {},
  getWordList: () => {},
  isRemoveWords: false,
  getStatusRemove: () => {},
  openModal: () => {},
  closeModal: () => {},
  isOpenModal: false,
};

export default TabContent;
