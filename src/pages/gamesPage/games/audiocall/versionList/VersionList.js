import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../components/button/Button';

import './VersionList.scss';

const VersionList = ({ items, onVersionClick, correctAnswer }) => {
  const [checkedItem, setCheckedItem] = useState(-1);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setCheckedItem(-1);
    setChecked(false);
    setCorrect(false);
  }, [items]);

  useEffect(() => {
    window.onkeydown = (evt) => {
      if (evt.key === '1' || evt.key === '2' || evt.key === '3' || evt.key === '4' || evt.key === '5') {
        let isCorrect = false;
        setCheckedItem(items[evt.key - 1]);
        setChecked(true);
        if (items[evt.key - 1] === correctAnswer) {
          setCorrect(true);
          isCorrect = true;
        }
        onVersionClick(isCorrect);
      }
    };
  }, [checked]);

  const buttons = items.map((item, idx) => {
    let iconName = '';
    let isActive = false;
    if (checkedItem === item) {
      if (correct) {
        iconName = 'check';
        isActive = true;
      } else {
        iconName = 'times';
        isActive = true;
      }
    }
    return (
      <Button
        id={`${idx}`}
        name="check"
        isActive={isActive}
        isDisabled={checked}
        label={`${idx + 1}. ${item}`}
        iconName={iconName}
        clickHandler={() => {
          let isCorrect = false;
          setCheckedItem(item);
          setChecked(true);
          if (item === correctAnswer) {
            setCorrect(true);
            isCorrect = true;
          }
          onVersionClick(isCorrect);
        }}
        key={`button-${idx + 1}`}
      />
    );
  });

  return (
    <div className="version-list">
      { buttons }
    </div>
  );
};

VersionList.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onVersionClick: PropTypes.func.isRequired,
  correctAnswer: PropTypes.string.isRequired,
};

export default VersionList;
