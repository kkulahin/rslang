import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Pagination } from 'semantic-ui-react';

import './TabContent.scss';

const Row = ({ word, onClickCrashButton }) => {
  const { origin, transcript, translation } = word;
  return (
    <tr className="row">
      <td className="row__item">{origin}</td>
      <td className="row__item">{transcript}</td>
      <td className="row__item">{translation}</td>
      <td className="row__item">
        <Icon name="trash alternate" className="row__crash-icon" onClick={onClickCrashButton} />
      </td>
    </tr>
  );
};

Row.propTypes = {
  word: PropTypes.instanceOf(Object).isRequired,
  onClickCrashButton: PropTypes.func.isRequired,
};

const TabContent = ({
  wordList, getWordList, getStatus,
}) => {
  const [words, setWords] = useState(wordList);
  const [deletedWords, setDeletedWords] = useState([]);
  // const [isUpdated, setUpdate] = useState(setStatus);
  const [controlPagination, setControlPagination] = useState({
    activePage: 1,
    maxPage: Math.ceil(wordList.length / 10),
    rowPerPage: 10,
  });
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
    />
  ));

  useEffect(() => {
    getWordList({ words, deletedWords });
    const newMaxItem = { ...controlPagination, maxPage: Math.ceil(words.length / 10) };
    setControlPagination(newMaxItem);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWordList, words]);

  const onChangeList = (e, { activePage }) => {
    const newActivePage = { ...controlPagination, activePage };
    setControlPagination(newActivePage);
  };

  return (
    <table className="tab-content">
      <thead className="tab-content__header">
        <tr className="row">
          <td className="row__item">Word</td>
          <td className="row__item">Transcript</td>
          <td className="row__item">Translation</td>
          <td className="row__item" />
        </tr>
      </thead>
      <tbody>
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
      </tbody>
    </table>
  );
};

TabContent.propTypes = {
  wordList: PropTypes.instanceOf(Array).isRequired,
  getStatus: PropTypes.func,
  getWordList: PropTypes.func,
};

TabContent.defaultProps = {
  getStatus: () => {},
  getWordList: () => {},
};

export default TabContent;
