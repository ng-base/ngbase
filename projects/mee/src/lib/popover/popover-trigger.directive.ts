import {
  Directive,
  ElementRef,
  TemplateRef,
  inject,
  input,
} from '@angular/core';
import { popoverPortal } from './popover.service';

@Directive({
  standalone: true,
  selector: '[meePopoverTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class PopoverTrigger {
  popoverPortal = popoverPortal();
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  meePopoverTrigger = input.required<TemplateRef<any>>();
  close: () => void = () => {};

  open() {
    const { diaRef } = this.popoverPortal.open(this.meePopoverTrigger(), {
      target: this.el.nativeElement,
      position: 'top',
    });
    this.close = diaRef.close;
  }
}
