import { SchoolURL } from '../config/default';
import appDefaultSettings from '../config/defaultSettings';
import responseFromServer, { makeRequest } from '../utils/responseFromServer';
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
    const { data, response } = await makeRequest('GET', 'users/%%userId%%/settings');
    if (!response.ok) {
      if (response.status === 404) {
        const [cardSettings, educationSettings, buttonSettings] = appDefaultSettings;
        const [, cardsCount] = educationSettings.settingsArr;
        const putData = {
          wordsPerDay: cardsCount.value,
          optional: {
            cardSettings,
            educationSettings,
            buttonSettings,
          },
        };
        const { response: postResponse } = await makeRequest(
          'PUT',
          'users/%%userId%%/settings',
          putData,
        );
        if (!postResponse.ok) {
          if (!postResponse.status === 401) {
            throw new Error(
              `POST settings failed with ${postResponse.status} ${postResponse.statusText}`,
            );
          }
        } else {
          this.settings = Object.values(putData.optional);
          settingSubject.notify(this.settings);
        }
      } else if (!response.status === 401) {
        throw new Error(
          `Get Statisctics failed with ${response.status} ${response.statusText}`,
        );
      }
    } else {
      this.settings = Object.values(data.optional);
      settingSubject.notify(this.settings);
    }
  };

  getCardsCount = () => {
    if (this.settings !== null) {
      const [, educationSettings] = this.settings;
      const [, cardsCount] = educationSettings.settingsArr;
      return cardsCount.value;
    }
    return 0;
  }

  saveConfig = async (config) => {
    this.settings = config;
    const [cardSettings, educationSettings, buttonSettings] = config;
    const [, cardsCount] = educationSettings.settingsArr;
    const putData = {
      wordsPerDay: cardsCount.value,
      optional: {
        cardSettings,
        educationSettings,
        buttonSettings,
      },
    };

    const { response } = await makeRequest('PUT', 'users/%%userId%%/settings', putData);
    if (response.ok) {
      settingSubject.notify(config);
    }
  };

  reset = () => {
    this.settings = null;
  }
}

const settingModel = new SettingModel();

export default settingModel;
