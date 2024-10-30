import { Component, inject } from '@angular/core';
import { Input } from '../input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../button';
import { ColorInput } from '../color-picker';

interface ThemeData {
  name: string;
  radius: string;
  space: string;
  background: string;
  foreground: string;
  primary: string;
  muted: string;
  border: string;
  text: string;
  input: string;
}

@Component({
  standalone: true,
  selector: 'mee-theme',
  imports: [Input, ReactiveFormsModule, Button, ColorInput],
  template: `
    <div class="mb-b4 flex gap-4">
      @for (theme of themes; track theme) {
        <button meeButton variant="outline" (click)="changeTheme(theme)">
          {{ theme.name }}
        </button>
      }
    </div>
    <form [formGroup]="form">
      <table>
        <tr>
          <td>Radius:</td>
          <td><input class="w-48" meeInput formControlName="radius" /></td>
        </tr>
        <tr>
          <td>Space:</td>
          <td><input class="w-48" meeInput formControlName="space" /></td>
        </tr>
        <tr>
          <td>Background:</td>
          <td><mee-color-input class="w-48" formControlName="background" /></td>
        </tr>
        <tr>
          <td>Foreground:</td>
          <td><mee-color-input class="w-48" formControlName="foreground" /></td>
        </tr>
        <tr>
          <td>Primary:</td>
          <td><mee-color-input class="w-48" formControlName="primary" /></td>
        </tr>
        <tr>
          <td>Muted:</td>
          <td><mee-color-input class="w-48" formControlName="muted" /></td>
        </tr>
        <tr>
          <td>Border:</td>
          <td><mee-color-input class="w-48" formControlName="border" /></td>
        </tr>
        <tr>
          <td>Text:</td>
          <td><mee-color-input class="w-48" formControlName="text" /></td>
        </tr>
      </table>
    </form>
  `,
})
export class ThemeComponent {
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    radius: ['0.5rem'],
    space: ['1rem'],
    background: ['#ffffff'],
    foreground: ['#000000'],
    primary: ['#000000'],
    muted: ['#71717a'],
    border: ['#000000'],
    text: ['#000000'],
    input: ['#000000'],
  });

  themes: ThemeData[] = [
    {
      name: 'Light',
      radius: '0.5rem',
      space: '0.25rem',
      background: '#f4f4f5',
      foreground: '#ffffff',
      primary: '#000000',
      muted: '#71717a',
      border: '#e4e4e7',
      text: '#000000',
      input: '#f3f4f6',
    },
    {
      name: 'Dark',
      radius: '0.5rem',
      space: '1rem',
      background: '#000000',
      foreground: '#191b23',
      primary: '#000000',
      muted: '#a1a1aa',
      border: '#27272a',
      text: '#ffffff',
      input: '#27272a',
    },
  ];

  constructor() {
    this.form.patchValue(this.themes[0]);
    this.form.valueChanges.subscribe(value => {
      const style = document.documentElement.style;
      style.setProperty('--radius', value.radius!);
      style.setProperty('--spacing-base', value.space!);
      style.setProperty('--background', this.colorRGB(value.background!));
      style.setProperty('--foreground', this.colorRGB(value.foreground!));
      style.setProperty('--primary', this.colorRGB(value.primary!));
      style.setProperty('--muted', this.colorRGB(value.muted!));
      style.setProperty('--border', this.colorRGB(value.border!));
      style.setProperty('--text', this.colorRGB(value.text!));
      style.setProperty('--input', this.colorRGB(value.input!));
    });

    console.log(this.colorRGB('#ffffff'));
  }

  colorRGB(color: string): string {
    if (this.isHex(color)) {
      color = this.hexToRgb(color);
    }
    const rgb = this.rgbToVariable(color);
    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }

  changeTheme(theme: ThemeData) {
    this.form.patchValue(theme);
  }

  isHex(hex: string) {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }

  hexToRgb(hex: string): string {
    const rgb = hex
      .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b)
      .substring(1)
      .match(/.{2}/g)
      ?.map(x => parseInt(x, 16));
    return rgb ? `rgb(${rgb.join(', ')})` : '';
  }

  rgbToHex(r: number, g: number, b: number) {
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }

  rgbToVariable(rgb: string): { r: number; g: number; b: number } {
    const [r, g, b] = rgb
      .substring(4, rgb.length - 1)
      .split(', ')
      .map(x => parseInt(x));
    return { r, g, b };
  }
}
