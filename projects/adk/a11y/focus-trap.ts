import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

@Directive({
  selector: '[ngbFocusTrap]',
})
export class FocusTrap {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly ngbFocusTrap = input(true, { transform: booleanAttribute });
  readonly focusInitial = input(true, { transform: booleanAttribute });

  // hacky way
  _focusTrap = linkedSignal(this.ngbFocusTrap);
  _focusInitial = linkedSignal(this.focusInitial);

  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;

  constructor() {
    let initialFocus = false;
    effect(cleanup => {
      if (this._focusTrap()) {
        const observer = new MutationObserver(() => this.setFocusableElements());
        observer.observe(this.el.nativeElement, { childList: true, subtree: true });
        // we have call this manually because mutation observer not trigger on initial render
        this.setFocusableElements();

        if (!initialFocus && this._focusInitial()) {
          initialFocus = true;
          // console.log('focusInitial', this.el.nativeElement);
          this.firstFocusableElement?.focus();
        }

        // listen to the keydown event
        this.el.nativeElement.addEventListener('keydown', this.onKeydown);

        cleanup(() => {
          this.el.nativeElement.removeEventListener('keydown', this.onKeydown);
          observer.disconnect();
        });
      }
    });
  }

  private setFocusableElements() {
    const focusableElements = this.el.nativeElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    this.firstFocusableElement = focusableElements[0];
    this.lastFocusableElement = focusableElements[focusableElements.length - 1];
  }

  onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement?.focus();
        }
      }
    }
  };
}
