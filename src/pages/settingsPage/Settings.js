import React, { useState, useEffect } from 'react';
import Modal from '../../components/modal/Modal';
import SettingsSection from './settingsSection/SettingsSection';
import settingsController from '../../controllers/SettingsController';
import settingSubject from '../../utils/observers/SettingSubject';

import './Settings.scss';
import confirmSubject from '../../utils/observers/ConfirmSubject';
import confirmResponseSubject from '../../utils/observers/ConfirmResponseSubject';

const Settings = () => {
  const [settings, setSettings] = useState(settingsController.get());
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    settingSubject.subscribe(setSettings);
    confirmSubject.subscribe(setConfirm);

    return () => {
      settingSubject.unsubscribe(setSettings);
      confirmSubject.unsubscribe(setConfirm);
    };
  }, [settings, setSettings, setConfirm]);

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
    return (
      <div className="spinner">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
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
      { confirm
        ? (
          <Modal
            content={confirm.message}
            contentHeader={confirm.title}
            clickHandler={() => setConfirm(null)}
            okHandler={() => confirmResponseSubject.notify(true)}
            cancelHandler={() => confirmResponseSubject.notify(false)}
          />
        ) : null }
    </div>
  );
};

export default Settings;
