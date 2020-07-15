import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DictionaryHelpImage = ({
  word: {
    image = '',
    wordTranslate = '',
  },
}) => {
  const [error, setError] = useState(null);

  const handleImgError = () => {
    setError('Sorry, we couldn\'t upload the image');
  };

  const element = (error)
    ? <div className="image--error">{error}</div>
    : <img src={`data:image/png;base64, ${image}`} alt={wordTranslate} onError={handleImgError} />;

  return (
    <div className="help-content__image">
      {element}
    </div>
  );
};

DictionaryHelpImage.defaultProps = {
  word: {},
};

export default DictionaryHelpImage;

DictionaryHelpImage.propTypes = {
  word: PropTypes.shape({
    image: PropTypes.string,
    wordTranslate: PropTypes.string,
  }),
};
