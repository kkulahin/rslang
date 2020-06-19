import React from 'react';
import teamInfo from './teamInfo/teamInfo';

import './aboutTeam.scss';

const AboutTeam = () => (
  <Person teamInfo={teamInfo} />
);

const Person = (team) => {
  const personInfo = team.teamInfo.map((el) => (

    <div className="cards_person" key={el.id}>
      <div className="avatar_and_name">
        <div className="avatar">
          <img src={el.avatar} alt="avatar" className="img_avatar" />
        </div>
        <div className="full_name">
          <p>
            {el.name.first}
            {el.name.sur}
          </p>
          <p>
            {el.name.nick}
          </p>
        </div>
      </div>
      <div className="about_person">
        <p>
          {el.aboutPerson}
        </p>
        <div className="contribution">
          <p>
            contribution:
            {' '}
            {el.contribution}
          </p>
          <div className="wrapper_contribution_line">
            <div className="contribution_line" style={{ width: el.contribution }} />
          </div>
        </div>
        <div>
          <p className="link_github">
            <a href={el.hrefGitHub}>
              <img src="/src/assets/image/icon/github.png" alt="gitHub link" className="github_img" />
            </a>
          </p>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="about_container">
      <p className="our_team">Our fantantastic team members</p>
      <div className="wrapper_card">
        { personInfo }
      </div>
    </div>
  );
};
export default AboutTeam;
