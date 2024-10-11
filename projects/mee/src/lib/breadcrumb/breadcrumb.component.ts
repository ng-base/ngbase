import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Icon } from '../icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { Breadcrumbs } from './breadcrumbs.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  standalone: true,
  selector: 'mee-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, NgTemplateOutlet],
  viewProviders: [provideIcons({ lucideChevronRight })],
  template: `
    <a
      class="hover:text-primary"
      [class.text-primary]="active()"
      [tabIndex]="active() ? -1 : 0"
      [attr.aria-current]="active() ? 'page' : null"
      [attr.aria-disabled]="active()"
      role="link"
    >
      <ng-content></ng-content>
    </a>
    @if (!active()) {
      @if (separator()) {
        <span class="text-muted" aria-hidden="true" role="presentation">
          <ng-template [ngTemplateOutlet]="separator()!"></ng-template>
        </span>
      } @else {
        <mee-icon
          name="lucideChevronRight"
          class="text-muted"
          role="presentation"
          aria-hidden="true"
        ></mee-icon>
      }
    }
  `,
  host: {
    class: 'flex items-center gap-b2 text-muted',
  },
})
export class Breadcrumb {
  readonly active = signal<boolean>(false);
  private breadcrumbs = inject(Breadcrumbs);
  readonly separator = this.breadcrumbs.separator;
}
