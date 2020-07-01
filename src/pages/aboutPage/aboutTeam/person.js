import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/button/Button';

const Person = ({ personInfo }) => {
  const {
    avatar, aboutPerson, linkGitHub, contribution, name: { first, sur, nick },
  } = personInfo;

  return (
    <div className="cards_person">
      <div className="avatar_and_name">
        <div className="avatar">
          <img src={avatar} alt="avatar" className="img_avatar" />
        </div>
        <div className="full_name">
          <p>
            {first}
            {' '}
            {sur}
          </p>
          <p>
            {nick}
          </p>
        </div>
      </div>
      <div className="about_person">
        <p>
          {aboutPerson}
        </p>
        <div className="contribution">
          <p>
            {contribution}
          </p>
        </div>
        <div className="link_github">
          { linkGitHub && (
          <a href={linkGitHub}>
            <Button id="" name="gitHubButton" label="" iconName="github" />
          </a>
          ) }
        </div>
      </div>
    </div>
  );
};

Person.propTypes = {
  personInfo: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    linkGitHub: PropTypes.string.isRequired,
    aboutPerson: PropTypes.string.isRequired,
    contribution: PropTypes.string.isRequired,
    name: PropTypes.shape({
      first: PropTypes.string.isRequired,
      sur: PropTypes.string.isRequired,
      nick: PropTypes.string.isRequired,
    }),
  }),
}.isRequired;

export default Person;
