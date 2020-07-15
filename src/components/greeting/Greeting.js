import React from 'react';
import PropTypes from 'prop-types';
import ContainerWithShadow from '../containerWithShadow/ContainerWithShadow';
import vectorMane from '../../assets/image/vector_man.png';

import './Greeting.scss';

const Greeting = ({ userName }) => {
  const greetingMessage = `Hello, ${userName === '' ? 'stranger' : userName}!`;
  const text = (userName === 'stranger')
    ? 'It\'s good to see you.'
    : 'It\'s good to see you again.';

  return (
    <ContainerWithShadow
      width="48%"
      height="160px"
      padding="0"
    >
      <div className="greeting">
        <div className="greeting__text">
          <h1>{greetingMessage}</h1>
          <p>{text}</p>
        </div>
        <img src={vectorMane} alt="Vector man" />
      </div>
    </ContainerWithShadow>
  );
};

Greeting.propTypes = {
  userName: PropTypes.string,
};

Greeting.defaultProps = {
  userName: 'stranger',
};

export default Greeting;
