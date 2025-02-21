import { Directive, ElementRef, TemplateRef, inject, input } from '@angular/core';
import { PopoverPosition, ngbPopoverPortal } from './popover.service';

@Directive({
  selector: '[ngbPopoverTrigger]',
  exportAs: 'ngbPopoverTrigger',
  host: {
    '(click)': 'open()',
  },
})
export class NgbPopoverTrigger {
  readonly popoverPortal = ngbPopoverPortal();
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly ngbPopoverTrigger = input.required<TemplateRef<any>>();
  readonly ngbPopoverTriggerData = input();
  readonly options = input<{ position?: PopoverPosition; anchor?: boolean }>();

  private closeFn: VoidFunction = () => {};

  open() {
    const options = this.options();
    const { diaRef } = this.popoverPortal.open(this.ngbPopoverTrigger(), {
      target: this.el.nativeElement,
      anchor: options?.anchor,
      position: options?.position || 'top',
      data: this.ngbPopoverTriggerData(),
    });
    this.closeFn = diaRef.close;
  }

  close() {
    this.closeFn();
  }
}
