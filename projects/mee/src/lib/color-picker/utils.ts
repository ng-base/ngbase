export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hslToRgb(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  const [r, g, b] = [f(0), f(8), f(4)];
  return `rgb(${r}, ${g}, ${b})`;
}

export function hexToRgb(hex: string): [number, number, number] {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

export function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0; // achromatic
  const b_: number = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

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

  return [h * 360, s * 100, b_ * 100];
}

export function hexToHsb(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsb(r, g, b);
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function parseRgb(rgb: string): [number, number, number] {
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return [r, g, b];
}

export function parseHsb(hsb: string): [number, number, number] {
  const [h, s, b] = hsb.match(/\d+/g)!.map(Number);
  return [h, s, b];
}

export function convertHsbToHsl(hsb: string): { h: number; s: number; l: number } {
  const [h, s, b] = parseHsb(hsb);
  return { h, s, l: b / 2 };
}

export function hsbToHsl(h: number, s: number, b: number): [number, number, number] {
  // Hue remains the same
  const hue = h;

  // Convert s and b from percentages to fractions
  const sat = s / 100;
  const bri = b / 100;

  // Calculate Lightness
  const lightness = bri * (1 - sat / 2);

  // Calculate Saturation
  let saturation: number;
  if (lightness === 0 || lightness === 1) {
    saturation = 0;
  } else {
    saturation = (bri - lightness) / Math.min(lightness, 1 - lightness);
  }

  // Convert saturation and lightness back to percentages
  const v = [hue, saturation * 100, lightness * 100];
  return v as [number, number, number];
}

export function hslToHsb(h: number, s: number, l: number): [number, number, number] {
  // Hue remains the same
  const hue = h;

  // Convert s and l from percentages to fractions
  const sat = s / 100;
  const light = l / 100;

  // Calculate Brightness
  const brightness = light + sat * Math.min(light, 1 - light);

  // Calculate Saturation
  let saturation: number;
  if (brightness === 0) {
    saturation = 0;
  } else {
    saturation = 2 * (1 - light / brightness);
  }

  // Convert saturation and brightness back to percentages
  return [hue, saturation * 100, brightness * 100];
}

export function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  s /= 100;
  b /= 100;

  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

  const r = Math.round(255 * f(5));
  const g = Math.round(255 * f(3));
  const b_ = Math.round(255 * f(1));

  return [r, g, b_];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function hsbToHex(h: number, s: number, b: number): string {
  const [r, g, b_] = hsbToRgb(h, s, b);
  return rgbToHex(r, g, b_);
}

// export function hsbToHsl(h: number, s: number, b: number): [number, number, number] {
//   const lightness = b * (1 - s / 200);
//   const saturation =
//     lightness === 0 || lightness === 1 ? 0 : (b - lightness) / Math.min(lightness, 1 - lightness);
//   return [h, saturation * 100, lightness * 100];
// }
