import React from 'react';
import Tabs from '../components/tabs/Tabs';
import TabContent from '../components/tabs/tabContent/TabContent';

const Dictionary = () => (
  <div>
    <Tabs>
      <div label="All">
        <TabContent
          wordList={[
            { origin: 'dog', transcript: '[dɒg]', translation: 'собака' },
            { origin: 'cat', transcript: '[kæt]', translation: 'кошка' },
            { origin: 'animal', transcript: '[ˈænɪməl]', translation: 'животное' },
            { origin: 'bear', transcript: '[beə]', translation: 'медведь' },
            { origin: 'wolf', transcript: '[wʊlf]', translation: 'волк' },
            { origin: 'fox', transcript: '[fɒks]', translation: 'лиса' },
          ]}
        />
      </div>
      <div label="Hard">
        <TabContent
          wordList={[
            { origin: 'JavaScript', transcript: '[ˈʤɑːvəskrɪpt]', translation: 'язык JavaScript' },
            { origin: 'Java', transcript: '[ˈʤɑːvə]', translation: 'Ява' },
            { origin: 'programming', transcript: '[ˈprəʊgræmɪŋ]', translation: 'программирование' },
          ]}
        />
      </div>
      <div label="Deleted">
        deleted
      </div>
    </Tabs>
  </div>
);

export default Dictionary;
