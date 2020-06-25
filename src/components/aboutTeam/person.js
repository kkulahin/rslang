import React from 'react';
import Button from '../button/Button';

const Person = ({ personInfo }) => {
  const {
    avatar, aboutPerson, linkGitHub, contribution, name: { first, sur, nick },
  } = personInfo;

  const linkBtn = linkGitHub !== undefined ? <Button iconName="github" name="gitHubButton" label="" /> : '';

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
          <a href={linkGitHub}>
            {linkBtn}
          </a>
        </div>
      </div>
    </div>
  );
};

Person.propTypes = {}.isRequired;

export default Person;
