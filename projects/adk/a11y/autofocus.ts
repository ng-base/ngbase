import { Directive, ElementRef, ApplicationRef, inject, input, afterRender } from '@angular/core';
import { isClient } from '@meeui/adk/utils';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[meeAutofocus]',
})
export class Autofocus {
  private el = inject(ElementRef);
  private applicationRef = inject(ApplicationRef);
  private document = inject(DOCUMENT);

  readonly focusDelay = input<number>(300);
  private isFocused = false;

  constructor() {
    if (isClient()) {
      afterRender({
        write: () => {
          // check if element is present in dom
          const isPresent = this.document.contains(this.el.nativeElement);
          if (isPresent && !this.isFocused) {
            this.isFocused = true;
            this.focusElement();
          } else if (!isPresent) {
            this.isFocused = false;
          }
        },
      });
    }
  }

  private focusElement() {
    const sub = this.applicationRef.isStable.subscribe(res => {
      if (res) {
        sub.unsubscribe();
        setTimeout(() => {
          this.el.nativeElement.focus();
        }, this.focusDelay());
      }
    });
  }
}
