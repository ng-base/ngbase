import { computed, Directive, effect, inject, ViewContainerRef } from '@angular/core';
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

  constructor() {
    const vcRef = inject(ViewContainerRef);
    effect(cleanup => {
      const separator = this.breadcrumbs.separator();
      if (separator && !this.active()) {
        vcRef.createEmbeddedView(separator);
        cleanup(() => vcRef.clear());
      }
    });
  }
}

export function aliasBreadcrumb(breadcrumb: typeof NgbBreadcrumb) {
  return { provide: NgbBreadcrumb, useExisting: breadcrumb };
}
