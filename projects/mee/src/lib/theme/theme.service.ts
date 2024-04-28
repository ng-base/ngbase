import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = true;

  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDark = true;
    } else {
      this.isDark = false;
    }
    if (this.isDark) {
      document.body.classList.add('dark');
    }
  }

  toggle() {
    const body = document.body;
    this.isDark = !this.isDark;
    if (this.isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }
}
