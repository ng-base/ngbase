import { computed, Directive, inject } from '@angular/core';
import { MeeBreadcrumbs } from './breadcrumbs';

@Directive({
  selector: '[meeBreadcrumb]',
  // template: `
  //   <a
  //     class="hover:text-primary"
  //     [class.text-primary]="active()"
  //     [tabIndex]="active() ? -1 : 0"
  //     [attr.aria-current]="active() ? 'page' : null"
  //     [attr.aria-disabled]="active()"
  //     role="link"
  //   >
  //     <ng-content />
  //   </a>
  //   @if (!active()) {
  //     @if (separator()) {
  //       <span class="flex items-center text-muted" aria-hidden="true" role="presentation">
  //         <ng-template [ngTemplateOutlet]="separator()!"></ng-template>
  //       </span>
  //     } @else {
  //       <mee-icon
  //         name="lucideChevronRight"
  //         class="text-muted"
  //         role="presentation"
  //         aria-hidden="true"
  //       />
  //     }
  //   }
  // `,
  host: {
    // '[tabIndex]': 'active() ? -1 : 0',
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
  readonly separator = this.breadcrumbs.separator;
}
