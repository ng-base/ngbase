import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  NgbBreadcrumb,
  NgbBreadcrumbLink,
  NgbBreadcrumbs,
  NgbBreadcrumbSeparator,
  NgbBreadcrumbSeparatorAria,
  provideBreadcrumb,
} from '@ngbase/adk/breadcrumb';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbBreadcrumbs],
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-2',
  },
})
export class Breadcrumbs {}

@Component({
  selector: 'mee-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideBreadcrumb(Breadcrumb)],
  viewProviders: [provideIcons({ lucideChevronRight })],
  imports: [Icon, NgbBreadcrumbLink, NgbBreadcrumbSeparatorAria],
  template: `
    <a class='hover:text-primary aria-[current="page"]:text-primary' ngbBreadcrumbLink>
      <ng-content />
    </a>
    @if (!active()) {
      <mee-icon ngbBreadcrumbSeparatorAria name="lucideChevronRight" class="text-muted" />
    }
  `,
  host: {
    class: 'flex items-center gap-2 text-muted',
  },
})
export class Breadcrumb extends NgbBreadcrumb {}

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
  hostDirectives: [NgbBreadcrumbSeparator],
})
export class BreadcrumbsSeparator {}
