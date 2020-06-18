const appDefaultSettings = [
  {
    sectionName: 'card',
    settingsArr: [
      {
        id: 1,
        name: 'Word translation',
        isChecked: true,
        isRequired: true,
      },
      {
        id: 2,
        name: 'Definition sentence',
        isChecked: true,
        isRequired: true,
      },
      {
        id: 3,
        name: 'Example sentence',
        isChecked: true,
        isRequired: true,
      },
      {
        id: 4,
        name: 'Show transcript',
        isChecked: true,
      },
      {
        id: 5,
        name: 'Show image',
        isChecked: true,
      },
      {
        id: 6,
        name: 'Sentence translation',
        isChecked: true,
      },
    ],
  },
  {
    sectionName: 'education',
    settingsArr: [
      {
        id: 1,
        name: 'New words per day',
        value: 5,
      },
      {
        id: 2,
        name: 'Words cards per day',
        value: 10,
      },
    ],
  },
  {
    sectionName: 'buttons',
    settingsArr: [
      {
        id: 1,
        name: 'Show answer',
        isChecked: true,
      },
      {
        id: 2,
        name: 'Delete card',
        isChecked: true,
      },
      {
        id: 3,
        name: 'Hard word category',
        isChecked: true,
      },
      {
        id: 4,
        name: 'Sound',
        isChecked: true,
      },
    ],
  },
];

export default appDefaultSettings;
