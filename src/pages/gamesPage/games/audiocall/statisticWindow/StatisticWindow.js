import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ContainerWithShadow from '../../../../../components/containerWithShadow/ContainerWithShadow';
import RoundProgressBar from '../../../../../components/roundProgressBar/RoundProgressBar';
import Button from '../../../../../components/button/Button';
import './StatisticWindow.scss';

const StatisticWindow = ({ gameStatistics, baseUrl, onClickButtonContinueGame }) => {
  const audioRef = useRef(null);
  const { gameStat, gameWords } = gameStatistics;
  const [visibleFirstTab, setVisibleFirstTab] = useState(true);

  const learnedWords = (gameStat.correct > 0) && (
    <>
      <h3 className="second-tab__title">Learned</h3>
      {
        gameWords.map((word) => {
          if (word[1]) {
            return (
              <p className="second-tab__row" key={word[0].id}>
                <Icon
                  className="second-tab__row-icon"
                  name="play"
                  size="large"
                  onClick={() => {
                    audioRef.current.src = `${baseUrl}${word[0].audio}`;
                    audioRef.current.play();
                  }}
                />
                {`${word[0].word}  ${word[0].transcription} - ${word[0].wordTranslate}`}
              </p>
            );
          }
          return null;
        })
      }
    </>
  );
  const needLearn = (gameStat.error > 0) && (
    <>
      <h3 className="second-tab__title">Need Learn</h3>
      {
        gameWords.map((word) => {
          if (!word[1]) {
            return (
              <p className="second-tab__row" key={word[0].id}>
                <Icon
                  className="second-tab__row-icon"
                  name="play"
                  size="large"
                  onClick={() => {
                    audioRef.current.src = `${baseUrl}${word[0].audio}`;
                    audioRef.current.play();
                  }}
                />
                {`${word[0].word}  ${word[0].transcription} - ${word[0].wordTranslate}`}
              </p>
            );
          }
          return null;
        })
      }
    </>
  );

  const tab = visibleFirstTab ? (
    <div className="statistic-window__tabs-first first-tab">
      <h3 className="first-tab__title">{`${gameStat.correct} correct answers`}</h3>
      <h3 className="first-tab__title">{`${gameStat.error} mistake(s)`}</h3>
      <RoundProgressBar
        value={gameStat.correct}
        maxValue={gameStat.correct + gameStat.error}
      />
    </div>
  ) : (
    <div className="statistic-window__tabs-second second-tab">
      <audio
        ref={audioRef}
      >
        <track kind="captions" />
      </audio>
      { learnedWords }
      { needLearn }
    </div>
  );

  return (
    <div className="statistic-window">
      <ContainerWithShadow>
        <div className="statistic-window__tabs">
          { tab }
        </div>
        <div className="statistic-window__footer">
          <div className="statistic-window__footer-bullets">
            <Icon
              name="circle"
              className="statistic-window__footer-bullet"
              onClick={() => setVisibleFirstTab(true)}
            />
            <Icon
              name="circle"
              className="statistic-window__footer-bullet"
              onClick={() => setVisibleFirstTab(false)}
            />
          </div>
          <Link to="/games">
            <Button
              id="1"
              name="check"
              label="Back to games"
              clickHandler={() => {}}
            />
          </Link>
          <Button
            id="2"
            name="check"
            label="Continue the game"
            clickHandler={onClickButtonContinueGame}
          />
        </div>
      </ContainerWithShadow>
    </div>
  );
};

StatisticWindow.propTypes = {
  gameStatistics: PropTypes.instanceOf(Object).isRequired,
  onClickButtonContinueGame: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
};

export default StatisticWindow;
