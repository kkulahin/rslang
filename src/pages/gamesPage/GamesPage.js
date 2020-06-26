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
    sprink: {
      link: 'sprint',
      pic: SpeakItPic,
    },
    audiocall: {
      link: 'audiocall',
      pic: AudioCallPic,
    },
  };

  useEffect(() => {
    getCategoryOrGames();
  });

  const buildColumn = () => {
    const listItems = Object.keys(games).map((g) => (
      <Grid.Column key={`${games[g].link}`}>
        <Link to={`${url}/${games[g].link}`}>
          <BlockWithShadow height="40vh" className="games-card">
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
      <Grid container columns={2} className="games-cards">
        {buildColumn()}
      </Grid>
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
      </Switch>
    </div>
  );
};

export default Games;
