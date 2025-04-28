import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import {
  aliasBreadcrumb,
  NgbBreadcrumb,
  NgbBreadcrumbLink,
  NgbBreadcrumbs,
  NgbBreadcrumbSeparator,
} from '@ngbase/adk/breadcrumb';

@Component({
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight })],
  hostDirectives: [NgbBreadcrumbs],
  imports: [Icon, NgbBreadcrumbSeparator],
  template: `<ng-content />
    <mee-icon *ngbBreadcrumbsSeparator name="lucideChevronRight" class="text-muted-foreground" /> `,
  host: {
    class: 'flex items-center gap-2',
  },
})
export class Breadcrumbs {}

@Component({
  selector: 'mee-breadcrumb, [meeBreadcrumb]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasBreadcrumb(Breadcrumb)],
  hostDirectives: [NgbBreadcrumbLink],
  template: `<ng-content />`,
  host: {
    class:
      'flex items-center gap-2 text-muted-foreground aria-[current="page"]:text-primary hover:text-primary cursor-pointer',
  },
})
export class Breadcrumb extends NgbBreadcrumb {}

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
  hostDirectives: [NgbBreadcrumbSeparator],
})
export class BreadcrumbsSeparator {}
