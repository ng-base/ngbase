import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[focusTrap]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class FocusTrap implements OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private observer!: MutationObserver;

  constructor() {
    this.observer = new MutationObserver(() => this.setFocusableElements());
    this.observer.observe(this.el.nativeElement, { childList: true, subtree: true });
  }

  private setFocusableElements() {
    const focusableElements = this.el.nativeElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    this.firstFocusableElement = focusableElements[0];
    this.lastFocusableElement = focusableElements[focusableElements.length - 1];
  }

  onKeydown(event: KeyboardEvent) {
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
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
