import React from 'react';
import {
  Header, Icon, Image, Step as SemanticStep, Button,
} from 'semantic-ui-react';

import { ProgressBar, Step } from 'react-step-progress-bar';
import TestImage from '../../../../assets/image/speakIt.png';

import './speakIt.scss';
import 'react-step-progress-bar/styles.css';

const SpeackIt = () => (
  <div className="speakIt">
    <div className="speakIt-header">
      <Header as="h2" className="games-header">
        <Icon name="game" />
        <Header.Content>SpeakIt</Header.Content>
      </Header>
    </div>
    <div className="app-speakIt" />
    <div className="speakIt-progressbar">
      <ProgressBar
        percent={0}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      >
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851"
              alt=""
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508"
              alt=""
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
              alt=""
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
              alt=""
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
              alt=""
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
              alt=""
            />
          )}
        </Step>
      </ProgressBar>
    </div>
    <div className="speakIt-image__wrapper">
      <Image src={TestImage} size="medium" bordered alt="" />
      <p>Word</p>
    </div>
    <div className="speakIt-items">
      <div className="item">
        <div className="item-icon">
          <Icon name="game" />
        </div>
        <div className="item-content">
          <p>Word</p>
          <p>[Word]</p>
        </div>
      </div>
      <div className="item">
        <div className="item-icon">
          <Icon name="game" />
        </div>
        <div className="item-content">
          <p>Word</p>
          <p>[Word]</p>
        </div>
      </div>
      <div className="item">
        <div className="item-icon">
          <Icon name="game" />
        </div>
        <div className="item-content">
          <p>Word</p>
          <p>[Word]</p>
        </div>
      </div>
      <div className="item">
        <div className="item-icon">
          <Icon name="game" />
        </div>
        <div className="item-content">
          <p>Word</p>
          <p>[Word]</p>
        </div>
      </div>
    </div>
    <div className="speakIt-panel">
      <Button primary>Restart</Button>
      <Button primary>Speak</Button>
      <Button primary>Results</Button>

    </div>
  </div>
);

export default SpeackIt;
