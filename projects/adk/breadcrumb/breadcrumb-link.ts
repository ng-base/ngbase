import { Directive, inject } from '@angular/core';
import { MeeBreadcrumb } from './public-api';

@Directive({
  selector: '[meeBreadcrumbLink]',
  host: {
    '[tabIndex]': 'breadcrumb.active() ? -1 : 0',
    '[attr.aria-current]': "breadcrumb.active() ? 'page' : null",
    '[attr.aria-disabled]': 'breadcrumb.active() || null',
    role: 'link',
  },
})
export class MeeBreadcrumbLink {
  readonly breadcrumb = inject(MeeBreadcrumb);
}
