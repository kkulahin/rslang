import React, { useState, useEffect } from 'react';
import SettingsSection from './settingsSection/SettingsSection';
import settingsController from '../../controllers/SettingsController';
import settingSubject from '../../utils/observers/SettingSubject';

import './Settings.scss';

const Settings = () => {
  const [settings, setSettings] = useState(settingsController.getConfig());

  useEffect(() => {
    settingSubject.subscribe(setSettings);
    if (settings === null) {
      settingsController.getConfigFromServer();
    }

    return () => settingSubject.unsubscribe(setSettings);
  }, [settings, setSettings]);

  const handleChange = (elementId, elementSectionName, newElementValue) => {
    const newSettings = settings.map((section) => {
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
    });
    settingsController.saveConfig(newSettings);
    setSettings(newSettings);
  };

  if (settings === null) {
    return (<div>Loading...</div>);
  }

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

export default Settings;
