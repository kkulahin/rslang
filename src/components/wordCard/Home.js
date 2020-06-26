import React, { useState } from 'react';
import WordCard from '../components/wordCard/WordCard';

const initHelpSettings = {
	isImageShow: true,
	isTranscriptionShow: true,
	isWordTranslateShow: true,
	isTextExampleShow: true,
	isTextMeaningShow: true,
	isTranslateShow: true,
};

const initSettings = {
	isShowAnswerBtn: true,
	isDeleteBtn: true,
	isHardBtn: true,
	isComplexityBtn: true,
	isAudioAuto: true,
};

const initWords = [
	{
		"id": '1',
    "group": 0,
    "page": 0,
    "word": "alcohol",
    "image": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002.jpg",
    "audio": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002.mp3",
    "audioMeaning": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002_meaning.mp3",
    "audioExample": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002_example.mp3",
    "textMeaning": "<i>Alcohol</i> is a type of drink that can make people drunk.",
    "textExample": "A person should not drive a car after he or she has been drinking <b>alcohol</b>.",
    "transcription": "[ǽlkəhɔ̀ːl]",
    "textExampleTranslate": "Человек не должен водить машину после того, как он выпил алкоголь",
    "textMeaningTranslate": "Алкоголь - это тип напитка, который может сделать людей пьяными",
    "wordTranslate": "алкоголь",
		"wordsPerExampleSentence": 15,
		'complexity': 'снова',
		'isHard': true,
	},
	{
		"id": '2',
    "group": 0,
    "page": 0,
    "word": "boat",
    "image": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005.jpg",
    "audio": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005.mp3",
    "audioMeaning": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005_meaning.mp3",
    "audioExample": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005_example.mp3",
    "textMeaning": "A <i>boat</i> is a vehicle that moves across water.",
    "textExample": "There is a small <b>boat</b> on the lake.",
    "transcription": "[bout]",
    "textExampleTranslate": "На озере есть маленькая лодка",
    "textMeaningTranslate": "Лодка - это транспортное средство, которое движется по воде",
    "wordTranslate": "лодка",
		"wordsPerExampleSentence": 8,
		'complexity': 'трудно',
		'isHard': false,
	},
	{
		"id": '3',
    "group": 0,
    "page": 0,
    "word": "agree",
    "image": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg",
    "audio": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.mp3",
    "audioMeaning": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_meaning.mp3",
    "audioExample": "https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001_example.mp3",
    "textMeaning": "To <i>agree</i> is to have the same opinion or belief as another person.",
    "textExample": "The students <b>agree</b> they have too much homework.",
    "transcription": "[əgríː]",
    "textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
    "textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
    "wordTranslate": "согласна",
		"wordsPerExampleSentence": 8,
		'complexity': 'хорошо',
		'isHard': true,
	},
];

const Home = () => {
	const [words, setWords] = useState([initWords[0]]);

	const handleNextBtnClick = () => {
		if (words[words.length - 1].id === '1') {
			setWords([initWords[0], initWords[1]]);
		} else if (words[words.length - 1].id === '2') {
			setWords([initWords[1], initWords[2]]);
		} else {
			setWords([initWords[0]]);
		}
	}

	return (
		<div>
			<WordCard
				helpSettings={initHelpSettings}
				settings={initSettings}
				words={words}
				onErrorAnswer={() => console.log('------ error answer ------')}
				onHardBtnClick={() => console.log('------ hard btn click ------')}
				onComplexityBtnClick={(id) => console.log(`------ complexity btn click ${id} ------`)}
				onDeleteBtnClick={() => console.log(`------ delete btn click ------`)}
				onNextBtnClick={handleNextBtnClick}
			/>
		</div>
	);
}

export default Home;
