import React from 'react';
import {
  Header, Icon, Image, Button,
} from 'semantic-ui-react';

import { ProgressBar, Step } from 'react-step-progress-bar';
import TestImage from '../../../../assets/image/speakIt.png';

import './speakIt.scss';
import 'react-step-progress-bar/styles.css';

const stepPic = [
  'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851',
  'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
  'https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png',
];

const defaultParams = {
  StepCounter: 6,
  Words: 10,
};

const SpeackIt = () => {
  const buildProgressStep = () => {
    const stepSize = Array.from({ length: defaultParams.StepCounter }, (v, k) => k);
    const stepEls = stepSize.map((s, index) => (
      <Step transition="scale" key={s}>
        {({ accomplished }) => (
          <img
            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
            width="30"
            src={stepPic[index]}
            alt=""
          />
        )}
      </Step>
    ));
    return (
      <ProgressBar
        percent={20}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      >
        {stepEls}
      </ProgressBar>
    );
  };

  const buildWordEl = () => {
    const wordSize = Array.from({ length: defaultParams.Words }, (v, k) => k);
    const wordEl = wordSize.map((w) => (
      <div className="item" key={w}>
        <div className="item-icon">
          <Icon name="game" />
        </div>
        <div className="item-content">
          <p>Word</p>
          <p>[Word]</p>
        </div>
      </div>
    ));
    return <>{wordEl}</>;
  };

  return (
    <div className="speakIt">
      <div className="speakIt-header">
        <Header as="h2" className="games-header">
          <Icon name="game" />
          <Header.Content>SpeakIt</Header.Content>
        </Header>
      </div>
      <div className="app-speakIt" />
      <div className="speakIt-progressbar">
        {buildProgressStep()}
      </div>
      <div className="speakIt-image__wrapper">
        <Image src={TestImage} size="medium" bordered alt="" />
        <p>Word</p>
      </div>
      <div className="speakIt-items">
        {buildWordEl()}
      </div>
      <div className="speakIt-panel">
        <Button primary>Restart</Button>
        <Button primary>Speak</Button>
        <Button primary>Results</Button>

      </div>
    </div>
  );
};

export default SpeackIt;
