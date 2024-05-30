import {
  Directive,
  ElementRef,
  TemplateRef,
  inject,
  input,
} from '@angular/core';
import { popoverPortal } from './popover.service';
import { DialogPosition } from '../portal';

@Directive({
  standalone: true,
  selector: '[meePopoverTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class PopoverTrigger {
  meePopoverTrigger = input.required<TemplateRef<any>>();
  popoverPortal = popoverPortal();
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  options = input<{ position?: DialogPosition; anchor?: boolean }>();
  close: VoidFunction = () => {};

  open() {
    const options = this.options();
    const { diaRef } = this.popoverPortal.open(this.meePopoverTrigger(), {
      target: this.el.nativeElement,
      anchor: options?.anchor,
      position: options?.position || 'top',
    });
    this.close = diaRef.close;
  }
}
