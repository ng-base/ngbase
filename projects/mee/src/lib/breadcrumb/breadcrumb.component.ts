import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icons } from '../icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'mee-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    class: 'flex items-center space-x-b2 text-muted',
  },
})
export class Breadcrumb {
  active = signal<boolean>(false);
}
