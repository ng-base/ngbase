import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MeeBreadcrumb,
  MeeBreadcrumbLink,
  MeeBreadcrumbSeparatorAria,
} from '@meeui/adk/breadcrumb';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'mee-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, NgTemplateOutlet, MeeBreadcrumbLink, MeeBreadcrumbSeparatorAria],
  viewProviders: [provideIcons({ lucideChevronRight })],
  template: `
    <a class='hover:text-primary aria-[current="page"]:text-primary' meeBreadcrumbLink>
      <ng-content />
    </a>
    @if (!breadcrumb.active()) {
      @if (breadcrumb.separator()) {
        <span class="flex items-center text-muted" meeBreadcrumbSeparatorAria>
          <ng-template [ngTemplateOutlet]="breadcrumb.separator()!"></ng-template>
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
  hostDirectives: [MeeBreadcrumb],
})
export class Breadcrumb {
  readonly breadcrumb = inject(MeeBreadcrumb);
}
