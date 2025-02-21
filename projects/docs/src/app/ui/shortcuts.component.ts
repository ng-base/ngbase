import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { keyMap } from '@ngbase/adk/keys';
import { injectTheme } from '@meeui/ui/theme';
import { DocCode } from './code.component';
import { Heading } from '@meeui/ui/typography';

@Component({
  imports: [DocCode, Heading],
  selector: 'app-shortcuts',
  template: `
    <h4 meeHeader="sm" class="mb-5">Shortcuts</h4>
    <app-doc-code [tsCode]="usage" hidePreview> </app-doc-code>
  `,
})
export default class ShortcutsComponent {
  private themeService = injectTheme();
  private router = inject(Router);

  usage = `
  import { keyMap } from '@ngbase/adk/keys';

  @Component({
    ...
  })
  class AppComponent {
    readonly themeService = injectTheme();
    readonly router = inject(Router);

    constructor() {
      keyMap('ctrl+d', () => this.themeService.toggle());
      keyMap('ctrl+a', () => this.router.navigate(['/buttons']));
    }
  }
  `;

  constructor() {
    keyMap('ctrl+d', () => this.themeService.toggle());
    keyMap('ctrl+a', () => this.router.navigate(['/buttons']));
  }
}
