import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  NgbBreadcrumb,
  NgbBreadcrumbLink,
  NgbBreadcrumbs,
  NgbBreadcrumbSeparator,
  NgbBreadcrumbSeparatorAria,
  provideBreadcrumb,
} from '@ngbase/adk/breadcrumb';

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
  imports: [NgbBreadcrumbLink, NgbBreadcrumbSeparatorAria],
  template: `
    <a class='hover:text-primary aria-[current="page"]:text-primary' ngbBreadcrumbLink>
      <ng-content />
    </a>
    @if (!active()) {
      <div ngbBreadcrumbSeparatorAria class="text-muted">/</div>
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
