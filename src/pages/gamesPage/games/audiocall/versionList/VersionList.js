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

  const buttons = items.map((item) => {
    let iconName = '';
    let isActive = false;
    if (checkedItem === item.id) {
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
        id={item.id}
        name="check"
        isActive={isActive}
        isDisabled={checked}
        label={item.word}
        iconName={iconName}
        clickHandler={(id) => {
          let isCorrect = false;
          setChecked(true);
          setCheckedItem(id);
          if (id === correctAnswer.id) {
            setCorrect(true);
            isCorrect = true;
          }
          onVersionClick(isCorrect);
        }}
        key={item.id}
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
  correctAnswer: PropTypes.instanceOf(Object).isRequired,
};

export default VersionList;
