import React from 'react';
import PropTypes from 'prop-types';

const HelpTextFormatted = ({ text, isFullState }) => {
  let classes = 'text--marked';
  if (!isFullState) {
    classes += ' text--hidden';
  }

  const regexp = new RegExp('(<b>|<i>)(.*)(<[/]b>|<[/]i>)', 'i');
  const splitted = text.split(regexp);

  return (
    <>
      {splitted[0]}
      <span className={classes}>{splitted[2]}</span>
      {splitted[4]}
    </>
  );
};

export default HelpTextFormatted;

HelpTextFormatted.propTypes = {
  text: PropTypes.string.isRequired,
  isFullState: PropTypes.bool.isRequired,
};
