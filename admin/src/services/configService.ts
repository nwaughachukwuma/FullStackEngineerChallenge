import axios from 'axios';
import {VueConfig} from '../../vue.config';

type ConfigType = {
  [key: string]: string|number|boolean;
}

class ConfigService {
  private config: ConfigType;
  
  constructor() {
    this.config = {};
  }

  loadConfig() {
    axios.get(`${VueConfig.publicPath}static/config.json`).then(response => {
      this.config = response.data;
    });
  }

  set(key: string, value: string|number|boolean) {
    this.config[key] = value;
  }

  get(key: string) {
    return this.config[key];
  }
}

export default new ConfigService();