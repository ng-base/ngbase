import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectDirectionality } from '@ngbase/adk/bidi';
import { injectNetwork } from '@ngbase/adk/network';
import { isClient } from '@ngbase/adk/utils';
import { sonnerPortal } from '@meeui/ui/sonner';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  readonly direction = injectDirectionality();
  readonly internetAvailability = injectNetwork();
  readonly sonner = sonnerPortal();

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
