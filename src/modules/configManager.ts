import { config } from "../../package.json";

interface APIConfig {
  name: string;
  api: string;
  secretKey: string;
  model: string;
  temperature: string;
  maxTokens: number;
  embeddingApi?: string;
  embeddingKey?: string;
  embeddingModel?: string;
}

const CONFIG_PREF_KEY = `${config.addonRef}.savedConfigs`;
const CURRENT_CONFIG_KEY = `${config.addonRef}.currentConfig`;

export default class ConfigManager {
  private configs: APIConfig[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const str = String(Zotero.Prefs.get(CONFIG_PREF_KEY) || "[]");
      this.configs = JSON.parse(str);
    } catch {
      this.configs = [];
    }
  }

  private save() {
    Zotero.Prefs.set(CONFIG_PREF_KEY, JSON.stringify(this.configs));
  }

  getConfigs(): APIConfig[] {
    return [...this.configs];
  }

  getCurrentConfigName(): string {
    return String(Zotero.Prefs.get(CURRENT_CONFIG_KEY) || "");
  }

  saveCurrentAsConfig(name: string): boolean {
    if (!name.trim()) return false;

    const newConfig: APIConfig = {
      name: name.trim(),
      api: String(Zotero.Prefs.get(`${config.addonRef}.api`) || ""),
      secretKey: String(Zotero.Prefs.get(`${config.addonRef}.secretKey`) || ""),
      model: String(Zotero.Prefs.get(`${config.addonRef}.model`) || ""),
      temperature: String(Zotero.Prefs.get(`${config.addonRef}.temperature`) || "1.0"),
      maxTokens: Number(Zotero.Prefs.get(`${config.addonRef}.maxTokens`) || 4096),
      embeddingApi: String(Zotero.Prefs.get(`${config.addonRef}.embeddingApi`) || ""),
      embeddingKey: String(Zotero.Prefs.get(`${config.addonRef}.embeddingKey`) || ""),
      embeddingModel: String(Zotero.Prefs.get(`${config.addonRef}.embeddingModel`) || ""),
    };

    // Update existing or add new
    const idx = this.configs.findIndex(c => c.name === name.trim());
    if (idx >= 0) {
      this.configs[idx] = newConfig;
    } else {
      this.configs.push(newConfig);
    }

    this.save();
    Zotero.Prefs.set(CURRENT_CONFIG_KEY, name.trim());
    return true;
  }

  switchToConfig(name: string): boolean {
    const cfg = this.configs.find(c => c.name === name);
    if (!cfg) return false;

    Zotero.Prefs.set(`${config.addonRef}.api`, cfg.api);
    Zotero.Prefs.set(`${config.addonRef}.secretKey`, cfg.secretKey);
    Zotero.Prefs.set(`${config.addonRef}.model`, cfg.model);
    Zotero.Prefs.set(`${config.addonRef}.temperature`, cfg.temperature);
    Zotero.Prefs.set(`${config.addonRef}.maxTokens`, cfg.maxTokens);
    if (cfg.embeddingApi) Zotero.Prefs.set(`${config.addonRef}.embeddingApi`, cfg.embeddingApi);
    if (cfg.embeddingKey) Zotero.Prefs.set(`${config.addonRef}.embeddingKey`, cfg.embeddingKey);
    if (cfg.embeddingModel) Zotero.Prefs.set(`${config.addonRef}.embeddingModel`, cfg.embeddingModel);

    Zotero.Prefs.set(CURRENT_CONFIG_KEY, name);
    return true;
  }

  deleteConfig(name: string): boolean {
    const idx = this.configs.findIndex(c => c.name === name);
    if (idx < 0) return false;

    this.configs.splice(idx, 1);
    this.save();

    if (this.getCurrentConfigName() === name) {
      Zotero.Prefs.set(CURRENT_CONFIG_KEY, "");
    }
    return true;
  }

  renameConfig(oldName: string, newName: string): boolean {
    if (!newName.trim() || oldName === newName) return false;
    const cfg = this.configs.find(c => c.name === oldName);
    if (!cfg) return false;

    cfg.name = newName.trim();
    this.save();

    if (this.getCurrentConfigName() === oldName) {
      Zotero.Prefs.set(CURRENT_CONFIG_KEY, newName.trim());
    }
    return true;
  }
}
