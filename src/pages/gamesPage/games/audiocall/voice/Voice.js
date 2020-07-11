import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Voice.scss';
import { Icon } from 'semantic-ui-react';

const Voice = ({ src }) => {
  let className = 'voice';
  const [addStyle, setAddStyle] = useState(false);
  const audioRef = useRef(null);

  if (addStyle) {
    className += ' voice--active';
  }

  return (
    <div
      role="button"
      className={className}
      onClick={() => {
        audioRef.current.play();
      }}
      onKeyPress={() => {}}
      tabIndex={0}
    >
      <Icon name="volume up" size="massive" />
      <audio
        autoPlay
        ref={audioRef}
        src={src}
        onPlaying={() => {
          setAddStyle(true);
        }}
        onEnded={() => {
          setAddStyle(false);
        }}
      >
        <track kind="captions" src={src} />
      </audio>
    </div>
  );
};

Voice.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Voice;
