import * as cc from './utils';

describe('Color Conversion Functions', () => {
  describe('hexToRgb', () => {
    it('should correctly convert 6-digit hex to RGBA', () => {
      expect(cc.hexToRgb('#FF0000')).toEqual([255, 0, 0, 1]);
      expect(cc.hexToRgb('#00FF00')).toEqual([0, 255, 0, 1]);
      expect(cc.hexToRgb('#0000FF')).toEqual([0, 0, 255, 1]);
    });

    it('should correctly convert 8-digit hex to RGBA', () => {
      expect(cc.hexToRgb('#FF0000FF')).toEqual([255, 0, 0, 1]);
      expect(cc.hexToRgb('#00FF0080')).toEqual([0, 255, 0, 0.5]);
      expect(cc.hexToRgb('#0000FF00')).toEqual([0, 0, 255, 0]);
    });

    it('should correctly convert 3-digit hex to RGBA', () => {
      expect(cc.hexToRgb('#F00')).toEqual([255, 0, 0, 1]);
      expect(cc.hexToRgb('#0F0')).toEqual([0, 255, 0, 1]);
      expect(cc.hexToRgb('#00F')).toEqual([0, 0, 255, 1]);
    });

    it('should correctly convert 4-digit hex to RGBA', () => {
      expect(cc.hexToRgb('#F00F')).toEqual([255, 0, 0, 1]);
      expect(cc.hexToRgb('#0F08')).toEqual([0, 255, 0, 0.53]);
      expect(cc.hexToRgb('#00F0')).toEqual([0, 0, 255, 0]);
    });

    it('should work with or without leading #', () => {
      expect(cc.hexToRgb('FF0000')).toEqual([255, 0, 0, 1]);
      expect(cc.hexToRgb('#FF0000')).toEqual([255, 0, 0, 1]);
    });

    it('should throw an error for invalid hex values', () => {
      expect(() => cc.hexToRgb('#GG0000')).toThrow('Invalid hex color format');
      //   expect(() => cc.hexToRgb('#FF00')).toThrow('Invalid hex color format');
      expect(() => cc.hexToRgb('#FF000')).toThrow('Invalid hex color format');
      expect(() => cc.hexToRgb('#FF00000')).toThrow('Invalid hex color format');
      expect(() => cc.hexToRgb('Invalid')).toThrow('Invalid hex color format');
    });
  });

  describe('rgbaToHsb', () => {
    it('should correctly convert RGBA to HSBA', () => {
      expect(cc.rgbaToHsb(255, 0, 0)).toEqual({ h: 0, s: 100, b: 100, a: 1 });
      expect(cc.rgbaToHsb(0, 255, 0)).toEqual({ h: 120, s: 100, b: 100, a: 1 });
      expect(cc.rgbaToHsb(0, 0, 255)).toEqual({ h: 240, s: 100, b: 100, a: 1 });
      expect(cc.rgbaToHsb(255, 255, 255)).toEqual({ h: 0, s: 0, b: 100, a: 1 });
      expect(cc.rgbaToHsb(0, 0, 0)).toEqual({ h: 0, s: 0, b: 0, a: 1 });
    });

    it('should handle alpha values', () => {
      expect(cc.rgbaToHsb(255, 0, 0, 0.5)).toEqual({ h: 0, s: 100, b: 100, a: 0.5 });
    });

    it('should throw an error for invalid RGBA values', () => {
      expect(() => cc.rgbaToHsb(256, 0, 0)).toThrow('Invalid RGB values');
      expect(() => cc.rgbaToHsb(-1, 0, 0)).toThrow('Invalid RGB values');
      expect(() => cc.rgbaToHsb(0, 0, 0, 2)).toThrow('Invalid alpha value');
    });
  });

  describe('hexToHsb', () => {
    it('should correctly convert hex to HSB', () => {
      expect(cc.hexToHsb('#FF0000')).toEqual([0, 100, 100, 1]);
      expect(cc.hexToHsb('#00FF00')).toEqual([120, 100, 100, 1]);
      expect(cc.hexToHsb('#0000FF')).toEqual([240, 100, 100, 1]);
      expect(cc.hexToHsb('#1677ff80')).toEqual([215, 91, 100, 0.5]);
    });
  });

  describe('rgbToHsl', () => {
    it('should correctly convert RGB to HSL', () => {
      expect(cc.rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
      expect(cc.rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
      expect(cc.rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
    });
  });

  describe('parseRgba', () => {
    it('should correctly parse RGBA strings', () => {
      expect(cc.parseRgba('rgba(255, 0, 0, 1)')).toEqual([255, 0, 0, 1]);
      expect(cc.parseRgba('rgb(0, 255, 0)')).toEqual([0, 255, 0, 1]);
    });

    it('should throw an error for invalid RGBA strings', () => {
      expect(() => cc.parseRgba('invalid')).toThrow('Invalid RGBA string format');
    });
  });

  describe('parseHsba', () => {
    it('should correctly parse HSBA strings', () => {
      expect(cc.parseHsba('hsba(0, 100%, 100%, 1)')).toEqual([0, 100, 100, 1]);
      expect(cc.parseHsba('hsb(120, 50%, 50%)')).toEqual([120, 50, 50, 1]);
    });

    it('should throw an error for invalid HSBA strings', () => {
      expect(() => cc.parseHsba('invalid')).toThrow('Invalid HSBA string format');
    });
  });

  describe('hsbToHsl', () => {
    it('should correctly convert HSB to HSL', () => {
      expect(cc.hsbToHsl(0, 100, 100)).toEqual([0, 100, 50]);
      expect(cc.hsbToHsl(120, 100, 100)).toEqual([120, 100, 50]);
      expect(cc.hsbToHsl(240, 100, 100)).toEqual([240, 100, 50]);
    });

    it('should handle edge cases', () => {
      expect(cc.hsbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
      expect(cc.hsbToHsl(0, 0, 100)).toEqual([0, 0, 100]);
      expect(cc.hsbToHsl(360, 100, 100)).toEqual([360, 100, 50]);
    });
  });

  describe('hslaToHsba', () => {
    it('should correctly convert HSLA to HSBA', () => {
      expect(cc.hslaToHsba(0, 100, 50)).toEqual([0, 100, 100, 1]);
      expect(cc.hslaToHsba(120, 100, 50)).toEqual([120, 100, 100, 1]);
      expect(cc.hslaToHsba(240, 100, 50)).toEqual([240, 100, 100, 1]);
    });

    it('should handle alpha values', () => {
      expect(cc.hslaToHsba(0, 100, 50, 0.5)).toEqual([0, 100, 100, 0.5]);
    });
  });

  describe('hsbaToRgba', () => {
    it('should correctly convert HSBA to RGBA', () => {
      expect(cc.hsbaToRgba(0, 100, 100)).toEqual([255, 0, 0, 1]);
      expect(cc.hsbaToRgba(120, 100, 100)).toEqual([0, 255, 0, 1]);
      expect(cc.hsbaToRgba(240, 100, 100)).toEqual([0, 0, 255, 1]);
      expect(cc.hsbaToRgba(360, 100, 100)).toEqual([255, 0, 0, 1]);
    });

    it('should handle alpha values', () => {
      expect(cc.hsbaToRgba(0, 100, 100, 0.5)).toEqual([255, 0, 0, 0.5]);
    });
  });

  describe('rgbToHsba', () => {
    it('should correctly convert RGB to HSBA', () => {
      expect(cc.rgbToHsba(255, 0, 0)).toEqual([0, 100, 100, 1]);
      expect(cc.rgbToHsba(0, 255, 0)).toEqual([120, 100, 100, 1]);
      expect(cc.rgbToHsba(0, 0, 255)).toEqual([240, 100, 100, 1]);
    });

    it('should handle alpha values', () => {
      expect(cc.rgbToHsba(255, 0, 0, 0.5)).toEqual([0, 100, 100, 0.5]);
    });
  });

  describe('hsbaToHex', () => {
    it('should correctly convert HSBA to hex', () => {
      expect(cc.hsbaToHex(0, 100, 100)).toBe('#FF0000');
      expect(cc.hsbaToHex(120, 100, 100)).toBe('#00FF00');
      expect(cc.hsbaToHex(240, 100, 100)).toBe('#0000FF');
    });

    it('should handle alpha values', () => {
      expect(cc.hsbaToHex(0, 100, 100, 0.5)).toBe('#FF000080');
    });
  });

  describe('rgbToHex', () => {
    it('should correctly convert RGB to 8-digit hex', () => {
      expect(cc.rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(cc.rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(cc.rgbToHex(0, 0, 255)).toBe('#0000FF');
    });

    it('should handle alpha values', () => {
      expect(cc.rgbToHex(255, 0, 0, 0.5)).toBe('#FF000080');
      expect(cc.rgbToHex(0, 255, 0, 0.25)).toBe('#00FF0040');
      expect(cc.rgbToHex(0, 0, 255, 0)).toBe('#0000FF00');
    });
  });

  describe('Conversion Roundtrips', () => {
    it('should correctly roundtrip RGB -> HSB -> RGB', () => {
      const original = [255, 128, 64];
      const hsb = cc.rgbaToHsb(255, 128, 64);
      const [r, g, b] = cc.hsbaToRgba(hsb.h, hsb.s, hsb.b);
      expect([r, g, b]).toEqual(original);
    });

    it('should correctly roundtrip HSB -> RGB -> HSB', () => {
      const original = [30, 75, 100];
      const [r, g, b] = cc.hsbaToRgba(30, 75, 100);
      const hsb = cc.rgbaToHsb(r, g, b);
      expect([Math.round(hsb.h), Math.round(hsb.s), Math.round(hsb.b)]).toEqual(original);
    });

    it('should correctly roundtrip HEX -> RGB -> HEX', () => {
      const original = '#A1B2C3';
      const rgb = cc.hexToRgb(original);
      const hex = cc.rgbToHex(...rgb);
      expect(hex).toBe(original);
    });
  });
});
