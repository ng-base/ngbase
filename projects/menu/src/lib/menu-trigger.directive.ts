import { Directive, ElementRef, inject, input } from '@angular/core';
import { popoverPortal } from '@meeui/popover';
import { Menu } from './menu.component';

@Directive({
  standalone: true,
  selector: '[meeMenuTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class MenuTrigger {
  meeMenuTrigger = input.required<Menu>();
  el = inject(ElementRef);
  popover = popoverPortal();
  close: () => void = () => {};

  open() {
    const { diaRef } = this.popover.open(
      this.meeMenuTrigger().container()!,
      this.el.nativeElement,
      { maxHeight: '400px' },
      'bl',
    );
    this.close = diaRef.close;
  }
}
