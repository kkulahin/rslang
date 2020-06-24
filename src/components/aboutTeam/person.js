import React from 'react';

const Person = ({ personInfo }) => {
  const {
    avatar, aboutPerson, hrefGitHub, contribution, name: { first, sur, nick },
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
        <div>
          <p className="link_github">
            <a href={hrefGitHub}>
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

Person.propTypes = {}.isRequired;

export default Person;
