import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectDirectionality } from '@meeui/adk/bidi';
import { injectNetwork } from '@meeui/adk/network';
import { isClient } from '@meeui/adk/utils';
import { sonnerPortal } from '@meeui/ui/sonner';
import { injectTheme } from '@meeui/ui/theme';

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
