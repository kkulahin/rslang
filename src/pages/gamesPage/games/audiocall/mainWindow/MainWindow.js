import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import VersionList from '../versionList/VersionList';
import Image from '../image/Image';
import Voice from '../voice/Voice';
import Button from '../../../../../components/button/Button';
import { getWords } from '../../../../../controllers/words/words';
import LinearProgressBar from '../../../../../components/linearProgressBar/LinearProgressBar';
import getWordVersions from './MainWindowFunctions';

const WORDCOUNTPERROUND = 20;

const MainWindow = ({ baseUrl, onEndOfGame, degree }) => {
  const [datas, setDatas] = useState(null);
  const cardRef = useRef(null);
  const mainRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showCardLoading, setShowCardLoading] = useState(true);
  const [nextButtonAvailable, setNextButtonAvailable] = useState(false);
  const [answers, setAnswers] = useState({
    correct: 0,
    error: 0,
  });
  const [level, setLevel] = useState(0);
  const [stepData, setStepData] = useState(null);
  const [gameWords, setGameWords] = useState([]);
  let currentWordNumber = null;
  let words = null;
  let versions = null;
  if (stepData) {
    currentWordNumber = stepData.currentWordNumber;
    words = stepData.words;
    versions = stepData.versions;
  }
  useEffect(() => {
    if (nextButtonAvailable) {
      window.onkeydown = (evt) => {
        if ((evt.code === 'ArrowRight' || evt.code === 'Enter') && nextButtonAvailable) {
          if (level < WORDCOUNTPERROUND - 1) {
            cardRef.current.classList.add('audiocall__card--animated');
            setTimeout(() => {
              cardRef.current.classList.remove('audiocall__card--animated');
            }, 950);
            setTimeout(() => {
              setLevel((s) => s + 1);
              setShowCardLoading(true);
              setNextButtonAvailable(false);
              setShowImage(false);
            }, 950);
          }
          if (level >= WORDCOUNTPERROUND - 1) {
            cardRef.current.classList.add('audiocall__card--animated');
            setTimeout(() => {
              cardRef.current.classList.remove('audiocall__card--animated');
              onEndOfGame({
                gameStat: answers,
                gameWords,
              });
            }, 950);
          }
        }
      };
    }
  }, [nextButtonAvailable]);

  useEffect(() => {
    if (datas) {
      getWordVersions(datas[level]).then((d) => {
        setStepData({
          ...d,
          versions: d.words.map((element, idx) => {
            if (d.currentWordNumber === idx) {
              return element.wordTranslate;
            }
            return element.translation.text;
          }),
        });
        setShowCardLoading(false);
      });
    }
  }, [level, datas]);

  useEffect(() => {
    getWords(Math.floor(degree / 30), degree % 30).then(({ data }) => {
      setDatas(data);
      setShowLoading(false);
    }).catch();
  }, [degree]);

  const card = showCardLoading
    ? (
      <div className="audiocall__card-loading">
        <Icon
          name="spinner"
          loading
          color="teal"
          size="massive"
        />
      </div>
    ) : (
      <>
        <div className="audiocall__card" ref={cardRef}>
          {
            showImage
              ? (
                <div
                  className="audiocall__image"
                >
                  <Image
                    src={`${baseUrl}${words[currentWordNumber].image}`}
                  />
                  <p className="audiocall__text">
                    <Icon name="volume up" className="audiocall__text-icon" />
                    <span className="audiocall__text-word">{words[currentWordNumber].word}</span>
                  </p>
                </div>
              ) : (
                <div className="audiocall__voice">
                  <Voice
                    src={`${baseUrl}${words[currentWordNumber].audio}`}
                    type="audio/mpeg"
                  />
                </div>
              )
          }
          <VersionList
            items={versions}
            onVersionClick={(answerIn) => {
              setGameWords((s) => [...s, [words[currentWordNumber], answerIn]]);
              setShowImage(true);
              if (answerIn) {
                setAnswers((s) => {
                  const result = {
                    correct: s.correct + 1,
                    error: s.error,
                  };
                  return result;
                });
              } else {
                setAnswers((s) => {
                  const result = {
                    correct: s.correct,
                    error: s.error + 1,
                  };
                  return result;
                });
              }
              setNextButtonAvailable(true);
            }}
            correctAnswer={versions[currentWordNumber]}
          />
        </div>
      </>
    );

  const content = stepData && (
    <>
      <div className="audiocall__main-header">
        <div className="audiocall__main-progress">
          { 'Step: ' }
          <LinearProgressBar value={level + 1} size={WORDCOUNTPERROUND} />
        </div>
        <div className="audiocall__main-progress">
          { `Level :  ${degree + 1} / 180` }
        </div>
      </div>
      { card }
      <div className="audiocall__button">
        <Button
          id="1"
          name="light"
          iconName=""
          label="Next"
          isDisabled={!nextButtonAvailable}
          clickHandler={() => {
            if (level < WORDCOUNTPERROUND - 1) {
              cardRef.current.classList.add('audiocall__card--animated');
              setTimeout(() => {
                cardRef.current.classList.remove('audiocall__card--animated');
              }, 950);

              setTimeout(() => {
                setLevel((s) => s + 1);
                setShowCardLoading(true);
                setNextButtonAvailable(false);
                setShowImage(false);
              }, 950);
            }
            if (level >= WORDCOUNTPERROUND - 1) {
              cardRef.current.classList.add('audiocall__card--animated');
              setTimeout(() => {
                cardRef.current.classList.remove('audiocall__card--animated');
                onEndOfGame({
                  gameStat: answers,
                  gameWords,
                });
              }, 950);
            }
          }}
        />
      </div>
    </>
  );
  return (
    <div
      className="audiocall__main"
      ref={mainRef}
    >
      {
        showLoading
          ? (
            <Icon
              name="spinner"
              loading
              color="teal"
              size="massive"
            />
          ) : content
      }
    </div>
  );
};

MainWindow.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  degree: PropTypes.number.isRequired,
  onEndOfGame: PropTypes.func.isRequired,
};

export default MainWindow;
