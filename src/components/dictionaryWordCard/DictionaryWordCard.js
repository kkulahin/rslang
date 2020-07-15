/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import DictionaryHelpImage from './dictionaryHelpImage/DictionaryHelpImage';
import DictionaryHelpText from './dictionaryHelpText/DictionaryHelpText';

const DictionaryWordCard = (props) => {
  const {
    settings: {
      isImageShow = true,
    },
    word,
  } = props;

  const data = [
    ['totalRepetition', 'Total repetition'],
    ['totalMistakes', 'Total mistakes'],
    ['lastRepetition', 'Last repetition'],
    ['nextRepetition', 'Next repetition'],
  ];

  const repetitionData = [];
  data.forEach((item) => {
    if (word[item[0]] !== undefined) {
      const element = (
        <li className="repetition-data__item" key={item[0]}>
          <p className="repetition-data__title">{item[1]}</p>
          <p className="repetition-data__data">
            {word[item[0]] !== undefined ? word[item[0]] : 'no data'}
          </p>
        </li>
      );
      repetitionData.push(element);
    }
  });

  return (
    <div className="card-content">
      <div className="help-content">
        {isImageShow && <DictionaryHelpImage {...props} />}
        <DictionaryHelpText {...props} />
      </div>
      <ul className="repetition-data">
        {repetitionData}
      </ul>
    </div>
  );
};

DictionaryWordCard.defaultProps = {
  settings: {},
  word: {},
};

export default DictionaryWordCard;

DictionaryWordCard.propTypes = {
  settings: PropTypes.shape({
    isImageShow: PropTypes.bool,
  }),
  word: PropTypes.objectOf(PropTypes.any),
};
