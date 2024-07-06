import { Directive, ElementRef, TemplateRef, inject, input } from '@angular/core';
import { popoverPortal } from '../popover';

@Directive({
  standalone: true,
  selector: '[meeHoverCard]',
  host: {
    '(mouseenter)': 'open()',
    '(mouseleave)': 'closePopup()',
  },
})
export class HoverCard {
  popoverPortal = popoverPortal();
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  meeHoverCard = input.required<TemplateRef<any>>();
  close: null | VoidFunction = null;
  inTimer: any;
  outTimer: any;

  open() {
    if (this.outTimer) {
      this.resetOut();
      return;
    }
    this.inTimer = setTimeout(() => {
      const { diaRef, events } = this.popoverPortal.open(
        this.meeHoverCard(),
        { target: this.el.nativeElement, position: 'top' },
        { backdrop: false },
      );
      this.close = diaRef.close;
      events.subscribe(e => {
        if (e.type === 'mouseleave') {
          this.closePopup();
        } else {
          this.resetOut();
        }
      });
    }, 400);
  }

  private resetOut() {
    clearTimeout(this.outTimer);
    this.outTimer = null;
  }

  closePopup() {
    clearTimeout(this.inTimer);
    this.inTimer = null;
    this.outTimer = setTimeout(() => {
      this.close?.();
      this.close = null;
      this.outTimer = null;
    }, 500);
  }
}
