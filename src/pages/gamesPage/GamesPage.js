import React, { useState, useEffect } from 'react';
import {
  Header, Icon, Grid, Image,
} from 'semantic-ui-react';
import { LoremIpsum } from 'react-lorem-ipsum';
import {
  Switch, Route, Link, useRouteMatch, useLocation,
} from 'react-router-dom';
import BlockWithShadow from '../../components/containerWithShadow/ContainerWithShadow';
import VectorMan from '../../assets/image/vector_man.png';
import './GamesPage.scss';

import SpeakItPic from '../../assets/image/speakIt.png';

import SpeakIt from './games/speakIt/SpeakIt';
import Sprint from './games/sprint/Sprint';

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

  useEffect(() => {
    getCategoryOrGames();
  });

  const TemplateCategory = () => (
    <>
      <Header as="h2" className="games-header">
        <Icon name="game" />
        <Header.Content>Games</Header.Content>
      </Header>
      <Grid container columns={2} className="games-cards">
        <Grid.Column>
          <Link to={`${url}/speakIt`}>
            <BlockWithShadow height="40vh" className="games-card">
              <Header as="h4" className="games-card__header">
                <Icon name="game" />
                <Header.Content>Speak it</Header.Content>
              </Header>
              <Image src={SpeakItPic} />
              <div className="games-card__description">
                {' '}
                <LoremIpsum p={1} />
                {' '}
              </div>
            </BlockWithShadow>
          </Link>
        </Grid.Column>
        <Grid.Column>
          <Link to={`${url}/sprint`}>
            <BlockWithShadow height="40vh" className="games-card">
              <Header as="h4" className="games-card__header">
                <Icon name="game" />
                <Header.Content>Speak it</Header.Content>
              </Header>
              <Image src={VectorMan} />
            </BlockWithShadow>
          </Link>
        </Grid.Column>
        <Grid.Column>
          <BlockWithShadow height="30vh" className="games-card">
            <Header as="h4" className="games-card__header">
              <Icon name="game" />
              <Header.Content>Speak it</Header.Content>
            </Header>
            <Image src={VectorMan} />
          </BlockWithShadow>
        </Grid.Column>
        <Grid.Column>
          <BlockWithShadow height="30vh" className="games-card">
            <Header as="h4" className="games-card__header">
              <Icon name="game" />
              <Header.Content>Speak it</Header.Content>
            </Header>
            <Image src={VectorMan} />
          </BlockWithShadow>
        </Grid.Column>
        <Grid.Column>
          <BlockWithShadow height="30vh">
            <Image src={VectorMan} />
          </BlockWithShadow>
        </Grid.Column>
        <Grid.Column>
          <BlockWithShadow height="30vh">
            <Image src={VectorMan} />
          </BlockWithShadow>
        </Grid.Column>
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
      </Switch>
    </div>
  );
};

export default Games;
