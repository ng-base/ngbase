import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { keyMap } from '@meeui/keys';
import { ThemeService } from '@meeui/theme';
import { DocCode } from './code.component';
import { Input } from '@meeui/input';

@Component({
  standalone: true,
  imports: [DocCode, Input],
  selector: 'app-shortcuts',
  template: `
    <app-doc-code [tsCode]="code">
      <input meeInput type="text" />
    </app-doc-code>
  `,
})
export class ShortcutsComponent {
  private themeService = inject(ThemeService);
  private router = inject(Router);

  code = `
    shortcutListener('ctrl+d', () => this.themeService.toggle());
    shortcutListener('ctrl+a', () => this.router.navigate(['/buttons']));
  `;

  constructor() {
    keyMap('ctrl+d', () => this.themeService.toggle());
    keyMap('ctrl+a', () => this.router.navigate(['/buttons']));
  }
}
