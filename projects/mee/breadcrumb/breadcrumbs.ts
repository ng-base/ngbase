import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { MeeBreadcrumbs, MeeBreadcrumbSeparator } from '@meeui/adk/breadcrumb';

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
  hostDirectives: [MeeBreadcrumbSeparator],
})
export class BreadcrumbsSeparator {}

@Component({
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-b2',
  },
  hostDirectives: [MeeBreadcrumbs],
})
export class Breadcrumbs {}
