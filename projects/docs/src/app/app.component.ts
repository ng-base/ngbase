import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sonnerPortal } from '@meeui/ui/sonner';
import { injectTheme } from '@meeui/ui/theme';
import { isClient } from '@meeui/ui/utils';
import { injectDirectionality, injectNetwork } from '@meeui/ui/adk';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  themeService = injectTheme();
  direction = injectDirectionality();
  internetAvailability = injectNetwork();
  sonner = sonnerPortal();

  constructor() {
    let initialStatus = this.internetAvailability.isOnline();

    if (isClient()) {
      this.internetAvailability.addListener(status => {
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
