import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, ApplicationRef, inject, input, OnDestroy } from '@angular/core';
import { isClient } from '@ngbase/adk/utils';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[ngbAutofocus]',
})
export class Autofocus implements OnDestroy {
  private el = inject(ElementRef);
  private applicationRef = inject(ApplicationRef);
  private intersectionObserver?: IntersectionObserver;
  private document = inject(DOCUMENT);
  readonly focusDelay = input<number>(300);
  private subscription?: Subscription;
  private isFocused = false;
  private client = isClient();

  constructor() {
    if (this.client) {
      this.elWatcher();
    }
  }

  private elWatcher() {
    // check if element is present in dom
    const isPresent = this.document.contains(this.el.nativeElement);
    if (isPresent && !this.isFocused) {
      this.isFocused = true;
      this.focusElement();
    } else if (!isPresent) {
      this.isFocused = false;
    }
    // this.intersectionObserver = new IntersectionObserver(
    //   entries => {
    //     entries.forEach(entry => {
    //       if (entry.isIntersecting) {
    //         this.focusElement();
    //       }
    //     });
    //   },
    //   { root: null, threshold: 0.1 },
    // );

    // this.intersectionObserver.observe(this.el.nativeElement);
  }

  // ngDoCheck() {
  //   if (this.client) {
  //     clearTimeout(this.timeout);
  //     this.timeout = setTimeout(() => {
  //       console.log('ngDoCheck', this.id);
  //       this.elWatcher();
  //     }, this.focusDelay());
  //   }
  // }

  private focusElement() {
    this.subscription?.unsubscribe();
    this.subscription = this.applicationRef.isStable.subscribe(res => {
      if (res) {
        this.subscription?.unsubscribe();
        this.subscription = undefined;
        this.el.nativeElement.focus();
      }
    });
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
  }
}
