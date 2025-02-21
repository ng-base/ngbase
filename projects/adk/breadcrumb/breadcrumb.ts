import { computed, Directive, inject, Type } from '@angular/core';
import { NgbBreadcrumbs } from './breadcrumbs';

@Directive({
  selector: '[ngbBreadcrumb]',
  host: {
    '[attr.aria-current]': "active() ? 'page' : null",
    '[attr.aria-disabled]': 'active()',
    role: 'link',
  },
})
export class NgbBreadcrumb {
  private breadcrumbs = inject(NgbBreadcrumbs);
  readonly active = computed(() => {
    const items = this.breadcrumbs.items();
    return items.indexOf(this) === items.length - 1;
  });
}

export function provideBreadcrumb(breadcrumb: Type<NgbBreadcrumb>) {
  return { provide: NgbBreadcrumb, useExisting: breadcrumb };
}
