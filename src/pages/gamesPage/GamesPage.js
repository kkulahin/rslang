import React, { useState, useEffect } from 'react';
import {
  Header, Icon, Grid, Image,
} from 'semantic-ui-react';
import {
  Switch, Route, Link, useRouteMatch, useLocation,
} from 'react-router-dom';
import BlockWithShadow from '../../components/containerWithShadow/ContainerWithShadow';
import './GamesPage.scss';

import SpeakItPic from '../../assets/image/speakIt.png';
import AudioCallPic from '../../assets/image/audiocall.png';

import SpeakIt from './games/speakIt/SpeakIt';
import Sprint from './games/sprint/Sprint';
import AudioCall from './games/audiocall/Audiocall';
import Savanna from './games/savanna/Savanna';

const Games = () => {
  const { path, url } = useRouteMatch();
  const [renderCategory, setRenderCategory] = useState(true);
  const location = useLocation();
  const getCategoryOrGames = () => setRenderCategory(url === location.pathname);

  const getGameClassname = () => {
    const gamePath = location.pathname.split(url).join('');
    const gameClass = gamePath.slice(1);
    return gameClass === '' ? 'games-category' : `game-${gameClass}`;
  };

  const games = {
    speakIt: {
      link: 'speakIt',
      pic: SpeakItPic,
    },
    sprint: {
      link: 'sprint',
      pic: SpeakItPic,
    },
    audiocall: {
      link: 'audiocall',
      pic: AudioCallPic,
    },
    savanna: {
      link: 'savanna',
      pic: SpeakItPic,
    },
  };

  useEffect(() => {
    getCategoryOrGames();
  });

  const buildColumn = () => {
    const listItems = Object.keys(games).map((g) => (
      <Grid.Column key={`${games[g].link}`}>
        <Link to={`${url}/${games[g].link}`}>
          <BlockWithShadow className="games-card">
            <Header as="h4" className="games-card__header">
              <Icon name="game" />
              <Header.Content>{games[g].link}</Header.Content>
            </Header>
            <Image src={games[g].pic} />
          </BlockWithShadow>
        </Link>
      </Grid.Column>
    ));
    return (
      <>{listItems}</>
    );
  };

  const TemplateCategory = () => (
    <>
      <Header as="h2" className="games-header">
        <Icon name="game" />
        <Header.Content>Games</Header.Content>
      </Header>
      <div className="games-cards">
        {buildColumn()}
      </div>
    </>
  );

  return (
    <div className={`games-wrapper ${getGameClassname()}`}>
      {!renderCategory ? null : <TemplateCategory /> }
      <Switch>
        <Route path={`${path}/speakIt`}>
          <SpeakIt />
        </Route>
        <Route path={`${path}/sprint`}>
          <Sprint />
        </Route>
        <Route path={`${path}/audiocall`}>
          <AudioCall />
        </Route>
        <Route path={`${path}/savanna`}>
          <Savanna />
        </Route>
      </Switch>
    </div>
  );
};

export default Games;
