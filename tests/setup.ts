import { vi } from 'vitest';

// 模拟 Zotero 偏好设置存储
const prefsStore: Record<string, any> = {};

// 定义全局 Zotero 对象
const MockZotero = {
  Prefs: {
    get: vi.fn((key: string) => {
      return prefsStore[key];
    }),
    set: vi.fn((key: string, value: any) => {
      prefsStore[key] = value;
    }),
    clear: vi.fn((key: string) => {
      delete prefsStore[key];
    }),
  },
  debug: vi.fn((msg: string) => console.log(`[Zotero Debug] ${msg}`)),
  logError: vi.fn((msg: string) => console.error(`[Zotero Error] ${msg}`)),
};

// 将 Mock 对象挂载到全局
// @ts-ignore
global.Zotero = MockZotero;

// 清理函数：每个测试前清空偏好设置
export function clearPrefs() {
  for (const key in prefsStore) {
    delete prefsStore[key];
  }
}
