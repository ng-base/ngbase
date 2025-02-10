import { computed, Directive, inject, Type } from '@angular/core';
import { MeeBreadcrumbs } from './breadcrumbs';

@Directive({
  selector: '[meeBreadcrumb]',
  host: {
    '[attr.aria-current]': "active() ? 'page' : null",
    '[attr.aria-disabled]': 'active()',
    role: 'link',
  },
})
export class MeeBreadcrumb {
  private breadcrumbs = inject(MeeBreadcrumbs);
  readonly active = computed(() => {
    const items = this.breadcrumbs.items();
    return items.indexOf(this) === items.length - 1;
  });
}

export function provideBreadcrumb(breadcrumb: Type<MeeBreadcrumb>) {
  return { provide: MeeBreadcrumb, useExisting: breadcrumb };
}
