import React from 'react';

import './Promo.scss';

const Promo = () => (
  <div className="promo">
    <div className="promo__header">
      <h2 className="promo__header-title">RS Lang App education system</h2>
      <p className="promo__header-text">
        Here is the text about what we did. Here is the text about what we did. Here is the text about what we did.
        Here is the text about what we did. Here is the text about what we did. Here is the text about what we did.
        Here is the text about what we did.
      </p>
    </div>

    <div className="promo__video">
      <iframe
        title="Promo video content for RS Lang"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/VSW7cSMdKiA"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
);

export default Promo;
