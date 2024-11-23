const MAX_RGB = 255;
const MAX_HUE = 360;
const MAX_PERCENTAGE = 100;

export function hexToRgb(hex: string): [number, number, number, number] {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Check for valid hex formats
  if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex)) {
    throw new Error('Invalid hex color format');
  }

  let r: number,
    g: number,
    b: number,
    a: number = 1;

  if (hex.length === 3 || hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    if (hex.length === 4) {
      a = parseInt(hex[3] + hex[3], 16) / 255;
    }
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    if (hex.length === 8) {
      a = parseInt(hex.slice(6, 8), 16) / 255;
    }
  } else {
    throw new Error('Invalid hex color format');
  }

  return [r, g, b, roundTo2Decimals(a)];
}

export function rgbaToHsb(
  r: number,
  g: number,
  b: number,
  a: number = 1,
): { h: number; s: number; b: number; a: number } {
  validateRgba(r, g, b, a);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: roundNum(h * 360),
    s: roundNum(s * 100),
    b: roundNum(v * 100),
    a: roundTo2Decimals(a),
  };
}

export function hexToHsb(hex: string): [number, number, number, number] {
  const [r, g, b, a] = hexToRgb(hex);
  const { h, s, b: brightness, a: alpha } = rgbaToHsb(r, g, b, a);
  return [roundNum(h), roundNum(s), roundNum(brightness), roundTo2Decimals(alpha)];
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  validateRgb(r, g, b);

  r /= MAX_RGB;
  g /= MAX_RGB;
  b /= MAX_RGB;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;

  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: roundNum(h * MAX_HUE),
    s: roundNum(s * MAX_PERCENTAGE),
    l: roundNum(l * MAX_PERCENTAGE),
  };
}

export function parseRgba(rgba: string): [number, number, number, number] {
  const matches = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
  if (!matches) {
    throw new Error('Invalid RGBA string format');
  }
  const [, r, g, b, a] = matches;
  return [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), a ? parseFloat(a) : 1];
}

export function parseHsba(hsb: string): [number, number, number, number] {
  const matches = hsb.match(/^hsba?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*(\d+(?:\.\d+)?))?\)$/);
  if (!matches) {
    throw new Error('Invalid HSBA string format');
  }
  const [, h, s, b, a] = matches;
  return [parseInt(h, 10), parseInt(s, 10), parseInt(b, 10), a ? parseFloat(a) : 1];
}

export function hsbToHsl(h: number, s: number, b: number): [number, number, number] {
  validateHsb(h, s, b);

  s /= MAX_PERCENTAGE;
  b /= MAX_PERCENTAGE;

  const l = b * (1 - s / 2);
  const saturation = l === 0 || l === 1 ? 0 : (b - l) / Math.min(l, 1 - l);

  return [roundNum(h), roundNum(saturation * MAX_PERCENTAGE), roundNum(l * MAX_PERCENTAGE)];
}

export function hslaToHsba(
  h: number,
  s: number,
  l: number,
  a: number = 1,
): [number, number, number, number] {
  validateHsl(h, s, l);
  validateAlpha(a);

  s /= MAX_PERCENTAGE;
  l /= MAX_PERCENTAGE;

  const brightness = l + s * Math.min(l, 1 - l);
  const saturation = brightness === 0 ? 0 : 2 * (1 - l / brightness);

  return [
    roundNum(h),
    roundNum(saturation * MAX_PERCENTAGE),
    roundNum(brightness * MAX_PERCENTAGE),
    roundTo2Decimals(a),
  ];
}

export function hsbaToRgba(
  h: number,
  s: number,
  b: number,
  a: number = 1,
): [number, number, number, number] {
  validateHsb(h, s, b);
  validateAlpha(a);

  s /= MAX_PERCENTAGE;
  b /= MAX_PERCENTAGE;

  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

  return [
    roundNum(f(5) * MAX_RGB),
    roundNum(f(3) * MAX_RGB),
    roundNum(f(1) * MAX_RGB),
    roundTo2Decimals(a),
  ];
}

export function rgbToHsba(
  r: number,
  g: number,
  b: number,
  a: number = 1,
): [number, number, number, number] {
  const { h, s, b: br, a: alpha } = rgbaToHsb(r, g, b, a);
  return [h, s, br, alpha];
}

export function hsbaToHex(h: number, s: number, b: number, a: number = 1): string {
  const [r, g, b_, a_] = hsbaToRgba(h, s, b, a);
  return rgbToHex(r, g, b_, a_);
}

export function rgbToHex(r: number, g: number, b: number, a: number = 1): string {
  validateRgb(r, g, b);
  validateAlpha(a);

  let rgba = [r, g, b];
  if (a < 1) {
    rgba.push(Math.round(a * 255));
  }

  return (
    '#' +
    rgba
      .map(x => Math.round(x).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function validateRgb(r: number, g: number, b: number): void {
  if (r < 0 || r > MAX_RGB || g < 0 || g > MAX_RGB || b < 0 || b > MAX_RGB) {
    throw new Error('Invalid RGB values');
  }
}

function validateRgba(r: number, g: number, b: number, a: number): void {
  validateRgb(r, g, b);
  validateAlpha(a);
}

function validateHsb(h: number, s: number, b: number): void {
  if (h < 0 || h > MAX_HUE || s < 0 || s > MAX_PERCENTAGE || b < 0 || b > MAX_PERCENTAGE) {
    throw new Error('Invalid HSB values');
  }
}

function validateHsl(h: number, s: number, l: number): void {
  if (h < 0 || h >= MAX_HUE || s < 0 || s > MAX_PERCENTAGE || l < 0 || l > MAX_PERCENTAGE) {
    throw new Error('Invalid HSL values');
  }
}

function validateAlpha(a: number): void {
  if (a < 0 || a > 1) {
    throw new Error('Invalid alpha value');
  }
}

function roundNum(num: number): number {
  return Math.round(num);
}

function roundTo2Decimals(num: number): number {
  return Math.round(num * 100) / 100;
}
