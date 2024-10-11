import {
  Directive,
  ElementRef,
  ApplicationRef,
  inject,
  input,
  effect,
  afterRender,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { generateId } from './utils';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[meeAutofocus]',
})
export class Autofocus {
  private el = inject(ElementRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private applicationRef = inject(ApplicationRef);
  private id = generateId();

  readonly focusDelay = input<number>(30);
  isFocused = false;

  constructor() {
    if (this.isBrowser) {
      afterRender({
        write: () => {
          // check if element is present in dom
          const isPresent = document.contains(this.el.nativeElement);
          if (isPresent && !this.isFocused) {
            this.isFocused = true;
            this.focusElement();
          } else if (!isPresent) {
            this.isFocused = false;
          }
          // console.log(`${this.id} is present: ${isPresent}`);
        },
      });
    }
    // effect(cleanup => {
    //   let timeout: any;
    //   let sub: Subscription | undefined;
    //   sub = this.applicationRef.isStable.subscribe(isStable => {
    //     if (isStable) {
    //       sub?.unsubscribe();
    //       sub = undefined;
    //       timeout = this.focusElement();
    //     }
    //   });
    //   cleanup(() => {
    //     sub?.unsubscribe();
    //     clearTimeout(timeout);
    //   });
    // });
  }

  private focusElement() {
    // Use requestAnimationFrame to ensure the browser has painted the DOM

    return setTimeout(
      () =>
        requestAnimationFrame(() => {
          console.log('focusing', this.el.nativeElement);
          this.el.nativeElement.focus();
        }),
      // () => this.el.nativeElement.focus(),
      this.focusDelay(),
    );
  }
}
