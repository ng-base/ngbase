import { Directive } from '@angular/core';
import { ɵFocusStyles as focusStyles } from '@meeui/ui/checkbox';

@Directive({
  selector: '[meeInputStyle]',
  host: {
    '[class]':
      "'mis inline-block rounded-lg bg-transparent px-2.5 py-2 border font-normal min-h-10 ' + focusStyles.focus + ' ' + focusStyles.within",
  },
})
export class InputStyle {
  readonly focusStyles = focusStyles;
}
