import React from 'react';
import PropTypes from 'prop-types';
import WordDefinition from '../../../utils/spacedRepetition/WordDefinition';
import { urlToAssets } from '../../../constants/urls';

const HelpImage = ({ helpSettings: { isImageShow }, word: { image, wordTranslate } }) => {
  const element = (
    <div className="help-content__image">
      <img src={urlToAssets + image} alt={wordTranslate} />
    </div>
  );

  return (
    isImageShow ? element : null
  );
};

export default HelpImage;

HelpImage.propTypes = {
  helpSettings: PropTypes.shape({
    isImageShow: PropTypes.bool.isRequired,
  }),
  word: PropTypes.instanceOf(WordDefinition),
};
