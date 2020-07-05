import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import { urlToAssets } from '../../../constants/urls';

const HelpImage = ({
  word: { definition: { image, wordTranslate } },
}) => {
  const [imageData, setImageData] = useState({
    loading: true,
    src: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(urlToAssets + image)
      .then((res) => res.blob())
      .then((data) => !cancelled && setImageData({
        loading: false,
        src: URL.createObjectURL(data),
        error: null,
      }))
      .catch(() => !cancelled && setImageData({
        loading: false,
        src: null,
        error: `Sorry, we couldn't upload the image`,
      }));

    return () => {
      cancelled = true;

      setImageData({
        loading: true,
        src: null,
        error: null,
      });
    };
  }, [image]);

  let element;
  if (imageData.loading) {
    element = <Spinner />;
  } else if (imageData.src) {
    element = <img src={imageData.src} alt={wordTranslate} />;
  } else {
    element = <p>{imageData.error}</p>;
  }

  return (
    <div className="help-content__image">
      {element}
    </div>
  );
};

export default HelpImage;

HelpImage.propTypes = {
  helpSettings: PropTypes.shape({
    isImageShow: PropTypes.bool.isRequired,
  }).isRequired,
  word: PropTypes.shape({
    definition: PropTypes.shape({
      image: PropTypes.string.isRequired,
      wordTranslate: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
