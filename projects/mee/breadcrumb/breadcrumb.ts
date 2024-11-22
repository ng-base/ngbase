import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { Breadcrumbs } from './breadcrumbs';

@Component({
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
      <ng-content />
    </a>
    @if (!active()) {
      @if (separator()) {
        <span class="flex items-center text-muted" aria-hidden="true" role="presentation">
          <ng-template [ngTemplateOutlet]="separator()!"></ng-template>
        </span>
      } @else {
        <mee-icon
          name="lucideChevronRight"
          class="text-muted"
          role="presentation"
          aria-hidden="true"
        />
      }
    }
  `,
  host: {
    class: 'flex items-center gap-b2 text-muted',
  },
})
export class Breadcrumb {
  private breadcrumbs = inject(Breadcrumbs);
  readonly active = computed(() => {
    const items = this.breadcrumbs.items();
    return items.indexOf(this) === items.length - 1;
  });
  readonly separator = this.breadcrumbs.separator;
}
