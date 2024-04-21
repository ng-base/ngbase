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
  el = inject(ElementRef);
  meePopoverTrigger = input.required<TemplateRef<any>>();
  close: () => void = () => {};

  open() {
    const { close } = this.popoverPortal.open(
      this.meePopoverTrigger(),
      this.el.nativeElement,
    );
    this.close = close;
  }
}
