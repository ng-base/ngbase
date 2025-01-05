import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[meeFocusStyle]',
  host: {
    class: 'outline-none',
    '[class]': `!unfocus() ? 'focus-visible:ring-2 focus:ring-2 focus:ring-offset-2 ring-primary focus-visible:ring-offset-2 ring-offset-background' : ''`,
  },
})
export class FocusStyle {
  unfocus = input(false, { transform: booleanAttribute });
}
