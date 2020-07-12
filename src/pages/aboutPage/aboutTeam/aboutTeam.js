import React from 'react';
import teamInfo from './teamInfo/teamInfo';
import Person from './person';

import './aboutTeam.scss';

const AboutTeam = () => (
  <div className="about_container">
    <p className="our_team">Our fantastic team members</p>
    <div className="wrapper_card">
      {teamInfo.map((person) => (<Person personInfo={person} key={person.id} />))}
    </div>
  </div>
);

export default AboutTeam;
