import { contentChild, contentChildren, Directive, TemplateRef } from '@angular/core';
import { MeeBreadcrumb } from './breadcrumb';
import { MeeBreadcrumbSeparator } from './breadcrumb-separator';

@Directive({
  selector: '[meeBreadcrumbs]',
  host: {
    'aria-label': 'breadcrumb',
  },
})
export class MeeBreadcrumbs {
  readonly items = contentChildren(MeeBreadcrumb);
  readonly separator = contentChild(MeeBreadcrumbSeparator, { read: TemplateRef });
}
