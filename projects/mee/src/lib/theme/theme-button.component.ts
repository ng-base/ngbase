import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './theme.service';
import { Icon } from '../icon';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { Button } from '../button';

@Component({
  standalone: true,
  selector: 'mee-theme-button',
  imports: [Icon, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMoon, lucideSun })],
  template: `
    <button meeButton variant="icon" class="tour-mode h-9 w-9" (click)="themeService.toggle()">
      <mee-icon [name]="themeService.mode() === 'dark' ? 'lucideMoon' : 'lucideSun'"></mee-icon>
    </button>
  `,
})
export class ThemeButton {
  readonly themeService = inject(ThemeService);
}
