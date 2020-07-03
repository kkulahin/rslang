const appDefaultSettings = [
  {
    sectionName: 'card',
    settingsArr: [
      {
        name: 'Word translation',
        isChecked: true,
        isRequired: true,
      },
      {
        name: 'Definition sentence',
        isChecked: true,
        isRequired: true,
      },
      {
        name: 'Example sentence',
        isChecked: true,
        isRequired: true,
      },
      {
        name: 'Show transcript',
        isChecked: true,
      },
      {
        name: 'Show image',
        isChecked: true,
      },
    ],
  },
  {
    sectionName: 'education',
    settingsArr: [
      {
        name: 'New words per day',
        value: 5,
      },
      {
        name: 'Words cards per day',
        value: 10,
      },
    ],
  },
  {
    sectionName: 'buttons',
    settingsArr: [
      {
        name: 'Show answer',
        isChecked: true,
      },
      {
        name: 'Delete card',
        isChecked: true,
      },
      {
        name: 'Categories of words',
        isChecked: true,
      },
      {
        name: 'Sound',
        isChecked: true,
      },
    ],
  },
];

export default appDefaultSettings;
