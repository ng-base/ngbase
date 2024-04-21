import {
  Directive,
  ElementRef,
  TemplateRef,
  inject,
  input,
} from '@angular/core';
import { popoverPortal } from '@meeui/popover';

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
  el = inject(ElementRef);
  meeHoverCard = input.required<TemplateRef<any>>();
  close: null | (() => void) = null;
  inTimer: any;
  outTimer: any;

  open() {
    if (this.outTimer) {
      this.resetOut();
      return;
    }
    this.inTimer = setTimeout(() => {
      const { close, events } = this.popoverPortal.open(
        this.meeHoverCard(),
        this.el.nativeElement,
        {
          backdrop: false,
        },
      );
      this.close = close;
      events.subscribe((e) => {
        if (e.type === 'mouseleave') {
          this.closePopup();
        } else {
          this.resetOut();
        }
      });
    }, 700);
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
    }, 700);
  }
}
