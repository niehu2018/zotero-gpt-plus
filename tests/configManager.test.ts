import { describe, it, expect, beforeEach, vi } from 'vitest';
import ConfigManager from '../src/modules/configManager';
import { clearPrefs } from './setup';

// Mock package.json config
vi.mock('../package.json', () => ({
  config: {
    addonRef: 'zoterogptplus',
  },
}));

describe('ConfigManager', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    clearPrefs();
    // Initialize Zotero.Prefs with default empty values for configs
    // @ts-ignore
    global.Zotero.Prefs.set('zoterogptplus.savedConfigs', '[]');
    // @ts-ignore
    global.Zotero.Prefs.set('zoterogptplus.currentConfig', '');
    
    configManager = new ConfigManager();
  });

  it('should initialize with empty configs', () => {
    expect(configManager.getConfigs()).toEqual([]);
    expect(configManager.getCurrentConfigName()).toBe('');
  });

  it('should save current settings as a new config', () => {
    // Setup current prefs
    // @ts-ignore
    const ZPrefs = global.Zotero.Prefs;
    ZPrefs.set('zoterogptplus.api', 'https://api.test.com');
    ZPrefs.set('zoterogptplus.secretKey', 'sk-test');
    ZPrefs.set('zoterogptplus.model', 'gpt-4');

    const success = configManager.saveCurrentAsConfig('Test Config');
    expect(success).toBe(true);

    const configs = configManager.getConfigs();
    expect(configs).toHaveLength(1);
    expect(configs[0].name).toBe('Test Config');
    expect(configs[0].api).toBe('https://api.test.com');
    expect(configs[0].secretKey).toBe('sk-test');
    expect(configs[0].model).toBe('gpt-4');
    
    expect(configManager.getCurrentConfigName()).toBe('Test Config');
  });

  it('should switch config', () => {
    // 1. Save a config first
    // @ts-ignore
    const ZPrefs = global.Zotero.Prefs;
    ZPrefs.set('zoterogptplus.model', 'gpt-3.5');
    configManager.saveCurrentAsConfig('Config A');

    // 2. Change prefs manually
    ZPrefs.set('zoterogptplus.model', 'gpt-4');
    
    // 3. Switch back to Config A
    const success = configManager.switchToConfig('Config A');
    expect(success).toBe(true);
    
    // 4. Verify prefs are restored
    expect(ZPrefs.get('zoterogptplus.model')).toBe('gpt-3.5');
    expect(configManager.getCurrentConfigName()).toBe('Config A');
  });

  it('should delete config', () => {
    configManager.saveCurrentAsConfig('To Delete');
    expect(configManager.getConfigs()).toHaveLength(1);

    const success = configManager.deleteConfig('To Delete');
    expect(success).toBe(true);
    expect(configManager.getConfigs()).toHaveLength(0);
    expect(configManager.getCurrentConfigName()).toBe('');
  });

  it('should fail to switch to non-existent config', () => {
    const success = configManager.switchToConfig('Non Existent');
    expect(success).toBe(false);
  });
});
