import { contentChild, contentChildren, Directive, TemplateRef } from '@angular/core';
import { NgbBreadcrumb } from './breadcrumb';
import { NgbBreadcrumbSeparator } from './breadcrumb-separator';

@Directive({
  selector: '[ngbBreadcrumbs]',
  host: {
    'aria-label': 'breadcrumb',
  },
})
export class NgbBreadcrumbs {
  readonly items = contentChildren(NgbBreadcrumb);
  readonly separator = contentChild(NgbBreadcrumbSeparator, { read: TemplateRef });
}
