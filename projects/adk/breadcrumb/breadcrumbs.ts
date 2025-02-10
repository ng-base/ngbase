import { contentChildren, Directive } from '@angular/core';
import { MeeBreadcrumb } from './breadcrumb';

@Directive({
  selector: '[meeBreadcrumbs]',
  host: {
    'aria-label': 'breadcrumb',
  },
})
export class MeeBreadcrumbs {
  readonly items = contentChildren(MeeBreadcrumb);
}
