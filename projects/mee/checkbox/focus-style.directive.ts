import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[meeFocusStyle]',
  host: {
    class: 'outline-none',
    '[class]': `!unfocus() ? 'focus-visible:ring-2 focus-within:ring-2 focus-within:ring-offset-2 ring-primary focus-visible:ring-offset-2 ring-offset-background data-[focus]:ring-2 data-[focus]:ring-offset-2 data-[focus]:ring-offset-background data-[focus]:ring-primary' : ''`,
  },
})
export class FocusStyle {
  unfocus = input(false, { transform: booleanAttribute });
}
