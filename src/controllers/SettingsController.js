import settingModel from '../models/SettingModel';

class SettingsController {
  getConfigFromServer = async () => settingModel.getConfigFromServer();

  getConfig = () => settingModel.getConfig();

  saveConfig = async (config) => settingModel.saveConfig(config);

  getCardsCount = () => settingModel.getCardsCount();
}

const settingsController = new SettingsController();

export default settingsController;
