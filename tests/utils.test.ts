import { describe, it, expect, vi } from 'vitest';
import Utils from '../src/modules/utils';

// Mock Meet/api to prevent cascading imports of Zotero globals
vi.mock('../src/modules/Meet/api', () => ({
  default: {
    Zotero: {
      getRelatedText: vi.fn()
    }
  }
}));

describe('Utils', () => {
  const utils = new Utils();

  describe('getRGB', () => {
    it('should convert 6-digit hex color to RGB array', () => {
      const hex = '#FF0000';
      const rgb = utils.getRGB(hex);
      expect(rgb).toEqual([255, 0, 0]);
    });

    it('should convert 3-digit hex color to RGB array', () => {
      const hex = '#0F0';
      const rgb = utils.getRGB(hex);
      expect(rgb).toEqual([0, 255, 0]);
    });

    it('should handle case insensitivity', () => {
      const hex = '#0000ff';
      const rgb = utils.getRGB(hex);
      expect(rgb).toEqual([0, 0, 255]);
    });

    it('should return original string if input is not a valid hex color', () => {
      const invalid = 'red';
      const result = utils.getRGB(invalid);
      expect(result).toBe('red');
    });
  });
});
