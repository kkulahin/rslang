import settingModel from '../models/SettingModel';

class SettingsController {
  getConfigFromServer = async () => settingModel.getConfigFromServer();

  get = () => {
    if (settingModel.getConfig() === null) {
      settingModel.getConfigFromServer();
    }
    return settingModel.getConfig();
  }

  getAsync = async () => {
    if (settingModel.getConfig() === null) {
      await settingModel.getConfigFromServer();
      return settingModel.getConfig();
    }
    return settingModel.getConfig();
  }

  saveConfig = async (config) => settingModel.saveConfig(config);

  getCardsCount = () => {
    if (this.get() === null) {
      return 0;
    }
    return settingModel.getCardsCount();
  }

  getSettingByName = (sectionName, name) => {
    const settings = this.get();
    if (settings === null) {
      return null;
    }
    const [section] = settings.filter((sec) => sec.sectionName === sectionName);
    const [item] = section.settingsArr.filter((itm) => itm.name === name);
    return item.value;
  }

  reset = () => {
    settingModel.reset();
  }
}

const settingsController = new SettingsController();

export default settingsController;
