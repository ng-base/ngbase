import { contentChildren, Directive } from '@angular/core';
import { NgbBreadcrumb } from './breadcrumb';

@Directive({
  selector: '[ngbBreadcrumbs]',
  host: {
    'aria-label': 'breadcrumb',
  },
})
export class NgbBreadcrumbs {
  readonly items = contentChildren(NgbBreadcrumb);
}
