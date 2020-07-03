import settingModel from '../models/SettingModel';

class SettingsController {
  getConfigFromServer = async () => settingModel.getConfigFromServer();

  getConfig = () => {
    if (settingModel.getConfig() === null) {
      settingModel.getConfigFromServer();
    }
    return settingModel.getConfig();
  }

  saveConfig = async (config) => settingModel.saveConfig(config);

  getCardsCount = () => {
    if (this.getConfig() === null) {
      return 0;
    }
    return settingModel.getCardsCount();
  }
}

const settingsController = new SettingsController();

export default settingsController;
