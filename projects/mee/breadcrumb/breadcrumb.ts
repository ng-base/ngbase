import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeBreadcrumb,
  MeeBreadcrumbLink,
  MeeBreadcrumbs,
  MeeBreadcrumbSeparator,
  MeeBreadcrumbSeparatorAria,
  provideBreadcrumb,
} from '@meeui/adk/breadcrumb';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MeeBreadcrumbs],
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-b2',
  },
})
export class Breadcrumbs {}

@Component({
  selector: 'mee-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideBreadcrumb(Breadcrumb)],
  viewProviders: [provideIcons({ lucideChevronRight })],
  imports: [Icon, MeeBreadcrumbLink, MeeBreadcrumbSeparatorAria],
  template: `
    <a class='hover:text-primary aria-[current="page"]:text-primary' meeBreadcrumbLink>
      <ng-content />
    </a>
    @if (!active()) {
      <mee-icon meeBreadcrumbSeparatorAria name="lucideChevronRight" class="text-muted" />
    }
  `,
  host: {
    class: 'flex items-center gap-b2 text-muted',
  },
})
export class Breadcrumb extends MeeBreadcrumb {}

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
  hostDirectives: [MeeBreadcrumbSeparator],
})
export class BreadcrumbsSeparator {}
