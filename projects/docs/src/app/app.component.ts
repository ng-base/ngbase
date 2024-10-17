import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { ThemeService } from '@meeui/theme';
import { ScrollArea } from '@meeui/scroll-area';
import { Directionality, InternetAvailabilityService, isClient } from '@meeui/utils';
import { sonnerPortal } from '@meeui/sonner';

@Component({
  standalone: true,
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, Button, ScrollArea],
  template: `<router-outlet />`,
})
export class AppComponent {
  themeService = inject(ThemeService);
  direction = inject(Directionality);
  internetAvailabilityService = inject(InternetAvailabilityService);
  sonner = sonnerPortal();
  isClient = isClient();

  constructor() {
    let initialStatus = this.internetAvailabilityService.isOnline();

    if (this.isClient) {
      this.internetAvailabilityService.addListener(status => {
        console.log('Internet availability changed:', status);
        if (status === initialStatus) return;
        initialStatus = status;
        if (status) {
          this.sonner.message('Internet', { description: 'Internet connection restored' });
        } else {
          this.sonner.error('Internet', { description: 'Internet connection lost' });
        }
      });
    }
  }
}
