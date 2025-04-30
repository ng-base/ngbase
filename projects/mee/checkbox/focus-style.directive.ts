import { Directive } from '@angular/core';

export const focusStyles = {
  within: 'focus-within:ring-[2px] focus-within:border-primary',
  focus:
    'outline-none focus-visible:ring-[2px] ring-primary/30 ring-offset-background focus-visible:border-primary',
};

@Directive({
  selector: '[meeFocusStyle]',
  host: {
    class: focusStyles.focus,
  },
})
export class FocusStyle {}
