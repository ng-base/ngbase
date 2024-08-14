import { Directive, ElementRef, TemplateRef, inject, input } from '@angular/core';
import { popoverPortal } from './popover.service';
import { DialogPosition } from '../portal';

@Directive({
  standalone: true,
  selector: '[meePopoverTrigger]',
  exportAs: 'meePopoverTrigger',
  host: {
    '(click)': 'open()',
  },
})
export class PopoverTrigger {
  popoverPortal = popoverPortal();
  el = inject<ElementRef<HTMLElement>>(ElementRef);

  meePopoverTrigger = input.required<TemplateRef<any>>();
  meePopoverTriggerData = input();

  options = input<{ position?: DialogPosition; anchor?: boolean }>();
  private closeFn: VoidFunction = () => {};

  open() {
    const options = this.options();
    const { diaRef } = this.popoverPortal.open(
      this.meePopoverTrigger(),
      {
        target: this.el.nativeElement,
        anchor: options?.anchor,
        position: options?.position || 'top',
      },
      { data: this.meePopoverTriggerData() },
    );
    this.closeFn = diaRef.close;
  }

  close() {
    this.closeFn();
  }
}
