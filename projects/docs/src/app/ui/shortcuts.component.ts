import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@meeui/ui/input';
import { keyMap } from '@meeui/ui/keys';
import { injectTheme } from '@meeui/ui/theme';
import { DocCode } from './code.component';

@Component({
  imports: [DocCode, Input],
  selector: 'app-shortcuts',
  template: `
    <app-doc-code [tsCode]="code">
      <input meeInput type="text" />
    </app-doc-code>
  `,
})
export class ShortcutsComponent {
  private themeService = injectTheme();
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
