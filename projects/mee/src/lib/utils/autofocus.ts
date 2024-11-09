import {
  Directive,
  ElementRef,
  ApplicationRef,
  inject,
  input,
  afterRender,
  PLATFORM_ID,
} from '@angular/core';
import { uniqueId } from './utils';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime, take } from 'rxjs';

@Directive({
  selector: '[meeAutofocus]',
  standalone: true,
})
export class Autofocus {
  private el = inject(ElementRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private applicationRef = inject(ApplicationRef);
  private id = uniqueId();

  readonly focusDelay = input<number>(300);
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

    this.applicationRef.isStable.pipe(take(1), debounceTime(400)).subscribe(() => {
      setTimeout(
        () => {
          // requestAnimationFrame(() => {
          //   console.log('focusing', this.el.nativeElement);
          //   this.el.nativeElement.focus();
          // });
          console.log('isStable', this.id);
          this.el.nativeElement.focus();
        },
        // () => this.el.nativeElement.focus(),
        this.focusDelay(),
      );
    });
  }
}
