import { SchoolURL } from '../config/default';
import appDefaultSettings from '../config/defaultSettings';
import responseFromServer from '../utils/responseFromServer';
import { getCookie } from '../utils/cookie';
import settingSubject from '../utils/observers/SettingSubject';

class SettingModel {
  constructor() {
    this.settings = null;
  }

  static configSavedMsg = {
    msg: 'Config saved successfully',
    status: true,
  };

  static configReceivedMsg = {
    msg: 'Config received successfully',
    status: true,
  };

  getConfig = () => this.settings;

  getConfigFromServer = async () => {
    let configFromServer;

    const userStr = getCookie('auth');

    if (userStr && userStr !== '') {
      const user = JSON.parse(userStr);
      try {
        const response = await responseFromServer(
          `${SchoolURL}/users/${user.userId}/settings`,
          user.token,
          SettingModel.configReceivedMsg,
          'GET',
        );
        configFromServer = Object.values(response.data.optional);
      } catch {
        configFromServer = null;
      }
    }
    this.settings = configFromServer || appDefaultSettings;
    settingSubject.notify(this.settings);
  };

  getCardsCount = () => {
    if (this.settings !== null) {
      const [, educationSettings] = this.settings;
      const [, cardsCount] = educationSettings.settingsArr;
      return cardsCount.value;
    }
    return 0;
  }

  saveConfig = (config) => {
    if (config === appDefaultSettings) {
      return;
    }
    settingSubject.notify(config);
    this.settings = config;
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
          SettingModel.configSavedMsg,
          'PUT',
          data,
        );
      } catch {
        console.log('No response from the server');
      }
    }
  };

  reset = () => {
    this.settings = null;
  }
}

const settingModel = new SettingModel();

export default settingModel;
