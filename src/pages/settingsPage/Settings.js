import React from 'react';
import PropsType from 'prop-types';
import SettingsSection from './settingsSection/SettingsSection';

import './Settings.scss';

const Settings = ({ settings, handleAppChange }) => {
  const handleChange = (elementId, elementSectionName, newElementValue) => handleAppChange(settings.map((section) => {
    const { sectionName, settingsArr } = section;

    if (sectionName === elementSectionName) {
      const itemId = settingsArr.findIndex((setting) => setting.name.replace(/\s/g, '-').toLowerCase() === elementId);

      if (newElementValue) {
        settingsArr[itemId].value = Number(newElementValue);
      } else {
        settingsArr[itemId].isChecked = !settingsArr[itemId].isChecked;
      }
    }

    return section;
  }));

  return (
    <div className="settings">
      {settings.map((settingsSection) => (
        <SettingsSection
          sectionInfo={settingsSection}
          handleChange={handleChange}
          key={settingsSection.sectionName}
        />
      ))}
    </div>
  );
};

Settings.propTypes = {
  settings: PropsType.arrayOf(PropsType.object).isRequired,
  handleAppChange: PropsType.func.isRequired,
};

export default Settings;
