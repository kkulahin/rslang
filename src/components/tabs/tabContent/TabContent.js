import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './TabContent.scss';
import { getWordsById } from '../../../controllers/words/words';

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

const TabContent = ({ wordList, getStatus, getWordList }) => {
  const [words, setWords] = useState(wordList);
  const [deletedWords, setDeletedWords] = useState([]);
  const [isUpdated, setUpdate] = useState(false);
  const rows = words.map((word, idx) => (
    <Row
      word={word}
      key={word.origin}
      onClickCrashButton={() => {
        const before = words.slice(0, idx);
        const after = words.slice(idx + 1);
        setDeletedWords([...deletedWords, words[idx]]);
        setWords([...before, ...after]);
        setUpdate(true);
      }}
    />
  ));

  useEffect(() => {
    if (getStatus !== undefined) {
      getStatus(isUpdated);
    }
  }, [isUpdated, getStatus]);

  useEffect(() => {
    getWordList({ words, deletedWords });
  }, [getWordList, words]);

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
