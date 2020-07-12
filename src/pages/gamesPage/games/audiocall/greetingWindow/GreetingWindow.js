import React, { useState, useEffect } from 'react';
import ReactCountDown from 'react-countdown-clock';
import PropTypes from 'prop-types';
import Button from '../../../../../components/button/Button';

import './GreetingWindow.scss';

const GreetingWindow = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [showInputError, setShowInputError] = useState({
    value: false,
    message: '',
  });
  const [level, setLevel] = useState({
    group: 0,
    page: 0,
  });

  const onClickToStart = () => {
    if (
      (document.querySelector('.greeting-window__input-group').value !== ''
      && document.querySelector('.greeting-window__input-page').value !== '')
      && (document.querySelector('.greeting-window__input-group').value >= 1
      && document.querySelector('.greeting-window__input-group').value <= 6
      && document.querySelector('.greeting-window__input-page').value >= 1
      && document.querySelector('.greeting-window__input-page').value <= 30)
    ) {
      setLevel({
        group: +document.querySelector('.greeting-window__input-group').value - 1,
        page: +document.querySelector('.greeting-window__input-page').value - 1,
      });
      setShowInputError({
        value: false,
        message: '',
      });
      setShowContent(false);
      setShowTimer(true);
    } else {
      setShowInputError({
        value: true,
        message: 'Incorrect input data: group must be less than 7 and more 0'
        + ', page must be less than 31 and more 0',
      });
    }
  };

  useEffect(() => {
    window.onkeydown = (evt) => {
      if (evt.code === 'Enter') {
        onClickToStart();
      }
    };
  }, []);

  const content = (
    <>
      <h2 className="greeting-window__title">Choose game difficulty</h2>
      <form className="greeting-window__form">
        <label htmlFor="group">
          Group:
          <input type="number" className="greeting-window__input-group" min="1" max="6" id="group" />
        </label>
        <hr />
        <label htmlFor="page">
          Page:
          <input type="number" className="greeting-window__input-page" min="1" max="30" id="page" />
        </label>
        <hr />
        {
          showInputError.value && <p className="greeting-window__form-error">{showInputError.message}</p>
        }
        <Button
          id="1"
          label="Start"
          name="check"
          clickHandler={onClickToStart}
        />
      </form>
    </>
  );

  const timer = (
    <ReactCountDown
      color="#25cede"
      alpha={0.9}
      seconds={5}
      weight={40}
      showMilliseconds={false}
      size={300}
      onComplete={() => {
        onComplete(level.group, level.page);
      }}
    />
  );

  return (
    <div className="greeting-window">
      {
        showContent && content
      }
      {
        showTimer && timer
      }
    </div>
  );
};

GreetingWindow.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default GreetingWindow;
