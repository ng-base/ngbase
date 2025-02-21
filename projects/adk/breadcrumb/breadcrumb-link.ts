import { Directive, inject } from '@angular/core';
import { NgbBreadcrumb } from './public-api';

@Directive({
  selector: '[ngbBreadcrumbLink]',
  host: {
    '[tabIndex]': 'breadcrumb.active() ? -1 : 0',
    '[attr.aria-current]': "breadcrumb.active() ? 'page' : null",
    '[attr.aria-disabled]': 'breadcrumb.active() || null',
    role: 'link',
  },
})
export class NgbBreadcrumbLink {
  readonly breadcrumb = inject(NgbBreadcrumb);
}
