import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sonnerPortal } from '@meeui/sonner';
import { ThemeService } from '@meeui/theme';
import { Directionality, InternetAvailability, isClient } from '@meeui/utils';

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
  internetAvailability = inject(InternetAvailability);
  sonner = sonnerPortal();

  constructor() {
    let initialStatus = this.internetAvailability.isOnline();

    if (isClient()) {
      this.internetAvailability.addListener(status => {
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
