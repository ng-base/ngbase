import { computed, Directive, inject } from '@angular/core';
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

export function aliasBreadcrumb(breadcrumb: typeof NgbBreadcrumb) {
  return { provide: NgbBreadcrumb, useExisting: breadcrumb };
}
