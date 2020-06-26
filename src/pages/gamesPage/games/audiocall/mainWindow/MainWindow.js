import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import VersionList from '../versionList/VersionList';
import Image from '../image/Image';
import Voice from '../voice/Voice';
import Button from '../../../../../components/button/Button';
import { getWords } from '../../../../../controllers/words/words';
import LinearProgressBar from '../../../../../components/linearProgressBar/LinearProgressBar';

const getRenderData = (arr) => {
  const currentWordNumber = Math.floor(Math.random() * 4) + 1;
  if (currentWordNumber === 0) { return [currentWordNumber, arr]; }
  const words = [];
  for (let i = 1, j = 0; j < arr.length; j += 1) {
    if (currentWordNumber === j) {
      words.push(arr[0]);
    } else {
      words.push(arr[i]);
      i += 1;
    }
  }

  return {
    currentWordNumber, words,
  };
};

const MainWindow = ({ baseUrl, onEndOfGame }) => {
  const [datas, setDatas] = useState(null);
  const cardRef = useRef(null);
  const mainRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
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
  if (stepData) {
    currentWordNumber = stepData.currentWordNumber;
    words = stepData.words;
  }

  useEffect(() => {
    if (datas) {
      setStepData({
        ...getRenderData(datas.slice(level, level + 5)),
      });
    }
  }, [level, datas]);

  useEffect(() => {
    getWords(0, 1).then(({ data }) => {
      setDatas(data);
      setShowLoading(false);
    }).catch();
  }, []);
  const content = stepData && (
    <>
      <LinearProgressBar value={level + 1} size={10} />
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
                  <span className="audiocall__text-word">{words[currentWordNumber].transcription}</span>
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
          items={words}
          onVersionClick={(answerIn) => {
            setGameWords((s) => [...s, [words[currentWordNumber], answerIn]]);
            setShowImage(true);
            setNextButtonAvailable(true);
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
          }}
          correctAnswer={words[currentWordNumber]}
        />
      </div>
      <div className="audiocall__button">
        <Button
          id="1"
          name="light"
          iconName=""
          label="Next"
          isDisabled={!nextButtonAvailable}
          clickHandler={() => {
            if (level < 9) {
              cardRef.current.classList.add('audiocall__card--animated');
              setTimeout(() => {
                cardRef.current.classList.remove('audiocall__card--animated');
              }, 1050);

              setTimeout(() => {
                setLevel(level + 1);
                setNextButtonAvailable(false);
                setShowImage(false);
              }, 950);
            }
            if (level >= 9) {
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
    <div className="audiocall__main" ref={mainRef}>
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
  onEndOfGame: PropTypes.func.isRequired,
};

export default MainWindow;
