import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sonnerPortal } from '@meeui/sonner';
import { ThemeService } from '@meeui/theme';
import { Directionality, InternetAvailabilityService, isClient } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
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
