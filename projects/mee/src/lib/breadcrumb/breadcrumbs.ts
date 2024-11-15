import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  Directive,
  TemplateRef,
} from '@angular/core';
import { Breadcrumb } from './breadcrumb';

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
})
export class BreadcrumbsSeparator {}

@Component({
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-b2',
    'aria-label': 'breadcrumb',
  },
})
export class Breadcrumbs {
  readonly items = contentChildren(Breadcrumb);
  readonly separator = contentChild(BreadcrumbsSeparator, { read: TemplateRef });
}
