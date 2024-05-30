import { Component, signal } from '@angular/core';
import { Icons } from '@meeui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'mee-breadcrumb',
  standalone: true,
  imports: [Icons],
  viewProviders: [provideIcons({ lucideChevronRight })],
  template: `
    <a class="hover:text-primary" [class.text-primary]="active()">
      <ng-content></ng-content>
    </a>
    @if (!active()) {
      <mee-icon
        name="lucideChevronRight"
        class="text-muted"
        role="presentation"
        aria-hidden="true"
      ></mee-icon>
    }
  `,
  host: {
    class: 'flex items-center space-x-h text-muted',
  },
})
export class Breadcrumb {
  active = signal<boolean>(false);
}
