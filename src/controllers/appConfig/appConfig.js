import { SchoolURL } from '../../config/default';
import appDefaultSettings from '../../config/defaultSettings';
import responseFromServer from '../../utils/responseFromServer';
import { getCookie } from '../../utils/cookie';
import settingQueueSubject from '../../utils/observers/SettingQueueSubject';

const configSavedMsg = {
  msg: 'Config saved successfully',
  status: true,
};

const configReceivedMsg = {
  msg: 'Config received successfully',
  status: true,
};

const getConfig = async () => {
  let configFromServer;
  const configFromLocalStorage = JSON.parse(localStorage.getItem('userSettings'));

  const user = JSON.parse(getCookie('auth'));

  if (user) {
    try {
      const response = await responseFromServer(
        `${SchoolURL}/users/${user.userId}/settings`,
        user.token,
        configReceivedMsg,
        'GET',
      );
      configFromServer = Object.values(response.data.optional);
    } catch {
      configFromServer = null;
    }
  }

  settingQueueSubject.notify(configFromServer || configFromLocalStorage || appDefaultSettings);
};

const saveConfig = (config) => {
  localStorage.setItem('userSettings', JSON.stringify(config));

  const [cardSettings, educationSettings, buttonSettings] = config;
  const [, cardsCount] = educationSettings.settingsArr;
  const data = {
    wordsPerDay: cardsCount.value,
    optional: {
      cardSettings,
      educationSettings,
      buttonSettings,
    },
  };

  const user = JSON.parse(getCookie('auth'));

  if (user) {
    try {
      responseFromServer(
        `${SchoolURL}/users/${user.userId}/settings`,
        user.token,
        configSavedMsg,
        'PUT',
        data,
      );
    } catch {
      console.log('No response from the server');
    }
  }
};

export { getConfig, saveConfig };
