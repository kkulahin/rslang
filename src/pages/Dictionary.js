import React from 'react';
import Tabs from '../components/tabs/Tabs';

const Dictionary = () => (
  <div>
    <Tabs>
      <div label="All">
        all
      </div>
      <div label="Hard">
        hard
      </div>
      <div label="Deleted">
        deleted
      </div>
    </Tabs>
  </div>
);

export default Dictionary;
