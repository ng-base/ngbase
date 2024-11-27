import { Directive, ElementRef, TemplateRef, inject, input, numberAttribute } from '@angular/core';
import { DialogRef } from '@meeui/adk/portal';
import { PopoverOptions, popoverPortal } from '@meeui/ui/popover';

@Directive({
  selector: '[meeHoverCard]',
  host: {
    '(mouseenter)': 'open()',
    '(mouseleave)': 'closePopup()',
  },
})
export class HoverCard<T = any> {
  private popoverPortal = popoverPortal();
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly meeHoverCard = input.required<TemplateRef<T>>();
  readonly options = input<PopoverOptions>();
  readonly delay = input(400, { transform: numberAttribute });

  private close: DialogRef | null = null;
  private inTimer: any;
  private outTimer: any;

  open() {
    // if the user is hovering over the popover, we don't want to open a new one
    if (this.outTimer) {
      this.resetOut();
      return;
    }

    // we need to delay the opening of the popover to ensure that the user is hovering over the popover
    this.inTimer = setTimeout(() => {
      const options = this.options() ?? {};
      const { diaRef, events } = this.popoverPortal.open(this.meeHoverCard(), {
        target: this.el.nativeElement,
        position: 'top',
        backdrop: false,
        ...options,
      });
      this.close = diaRef;
      events.subscribe(e => {
        if (e.type === 'mouseleave') {
          this.closePopup();
        } else {
          this.resetOut();
        }
      });
    }, this.delay());
  }

  private resetOut() {
    clearTimeout(this.outTimer);
    this.outTimer = null;
  }

  closePopup() {
    clearTimeout(this.inTimer);
    this.inTimer = null;
    if (!this.close) return;
    this.outTimer = setTimeout(() => {
      this.close?.close();
      this.close = null;
      this.outTimer = null;
    }, this.delay());
  }
}
