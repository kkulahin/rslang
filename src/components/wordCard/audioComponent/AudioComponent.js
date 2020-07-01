import React, { useState, useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';

import Button from '../button/Button';
import Spinner from '../spinner/Spinner';
import { urlToAssets } from '../../../constants/urls';
// import Word from '../../../utils/spacedRepetition/Word';

const AudioComponent = (props) => {
  const {
		helpSettings: { isTextExampleShow, isTextMeaningShow },
		settings: { isComplexityBtn },
		word: { definition: { audio, audioExample, audioMeaning } },
		isPrevWord,
		isCorrect,
		isShowBtnClick,
		isAudioOn,
	} = props;

	const audioRef = useRef();

	const [currentTruck, setCurrentTruck] = useState(0);
	const [audioData, setAudioData] = useState({
		loading: true,
		src: null,
		error: null,
	});

	const tracks = [urlToAssets + audio];
	if (isTextExampleShow) {
		tracks.push(urlToAssets + audioExample);
	}
	if (isTextMeaningShow) {
		tracks.push(urlToAssets + audioMeaning);
	}

	useEffect(() => {
		if (isAudioOn.audioOn) {
			setCurrentTruck(0);
			setAudioData({
				loading: true,
				src: null,
				error: null,
			});
		} else {
			audioRef.current.pause();
		}
	}, [isAudioOn]);

	useEffect(() => {
		let cancelled = false;

		fetch(tracks[currentTruck])
			.then(res => res.blob())
			.then(blob => {
				!cancelled && setAudioData({
					loading: false,
					src: URL.createObjectURL(blob),
					error: null,
				});
				audioRef.current.play();
			})
			.catch(() => {
				!cancelled && setAudioData({
					loading: false,
					src: null,
					error: 'Sorry, we couldn\'t upload the audio',
				});
				onAudioEnded();
			});

		return () => {
			cancelled = true;

			setAudioData({
				loading: false,
				src: null,
				error: null,
			});
		};
	}, [currentTruck]);

	const handleAudioPlayBtnClick = () => {
		setCurrentTruck(0);
	};

	const onAudioEnded = () => {
    if (currentTruck < tracks.length - 1) {
			setCurrentTruck((currentTruck) => currentTruck + 1);
      return;
    }

    // if ((isCorrect || isShowBtnClick) && !isComplexityBtn) {
    //   getNextWord();
    // }
  };

  const AudioPlayBtnEnabled = isPrevWord || ((isCorrect || isShowBtnClick) && isComplexityBtn) || !audioData.loading;

  return (
    <div className="card-controls__audio-btn">
      <Button
        id="speakWord"
        label="Speak"
        isDisabled={!AudioPlayBtnEnabled}
        clickHandler={handleAudioPlayBtnClick}
      />
			{audioData.loading && <Spinner />}
			<audio
				ref={audioRef}
				src={audioData.src}
				onEnded={onAudioEnded}
			/>
    </div>
  );
};

export default AudioComponent;

// AudioComponent.propTypes = {
//   isWordInput: PropTypes.bool.isRequired,
//   isCorrect: PropTypes.bool.isRequired,
//   isPrevWord: PropTypes.bool.isRequired,
//   onCardBtnClick: PropTypes.func.isRequired,
//   helpSettings: PropTypes.object.isRequired,
//   word: PropTypes.instanceOf(Word).isRequired,
//   settings: PropTypes.shape({
//     isShowAnswerBtn: PropTypes.bool.isRequired,
//     isDeleteBtn: PropTypes.bool.isRequired,
//   }).isRequired,
//   helpSettings: PropTypes.shape({
//     isImageShow: PropTypes.bool.isRequired,
//   }).isRequired,
// };