import { Directive, ElementRef, TemplateRef, inject, input } from '@angular/core';
import { PopoverPosition, meePopoverPortal } from './popover.service';

@Directive({
  selector: '[meePopoverTrigger]',
  exportAs: 'meePopoverTrigger',
  host: {
    '(click)': 'open()',
  },
})
export class MeePopoverTrigger {
  readonly popoverPortal = meePopoverPortal();
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly meePopoverTrigger = input.required<TemplateRef<any>>();
  readonly meePopoverTriggerData = input();
  readonly options = input<{ position?: PopoverPosition; anchor?: boolean }>();

  private closeFn: VoidFunction = () => {};

  open() {
    const options = this.options();
    const { diaRef } = this.popoverPortal.open(this.meePopoverTrigger(), {
      target: this.el.nativeElement,
      anchor: options?.anchor,
      position: options?.position || 'top',
      data: this.meePopoverTriggerData(),
    });
    this.closeFn = diaRef.close;
  }

  close() {
    this.closeFn();
  }
}
